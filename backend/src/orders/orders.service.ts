import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, Role, User } from '@prisma/client';
import { PaginationDto, paginate } from '../common/dto/pagination.dto';

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
  CONFIRMED: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  PROCESSING: [OrderStatus.SHIPPED],
  SHIPPED: [OrderStatus.DELIVERED],
  DELIVERED: [OrderStatus.REFUNDED],
  CANCELLED: [],
  REFUNDED: [],
};

const TAX_RATE = 0.08;
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 100;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartService,
  ) {}

  async checkout(userId: string, dto: CreateOrderDto) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const address = await this.prisma.address.findFirst({ where: { id: dto.addressId, userId } });
    if (!address) throw new NotFoundException('Address not found');

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new BadRequestException(`Product "${item.product.name}" is no longer available`);
      }
      if (item.product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${item.product.name}". Available: ${item.product.stock}`,
        );
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    let discountAmount = 0;
    if (dto.couponCode) {
      const couponResult = await this.cartService.validateCoupon(dto.couponCode, subtotal);
      discountAmount = couponResult.discountAmount;
    }

    const shippingCost = subtotal - discountAmount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const taxable = subtotal - discountAmount;
    const tax = +(taxable * TAX_RATE).toFixed(2);
    const total = +(taxable + shippingCost + tax).toFixed(2);

    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId: dto.addressId,
          status: OrderStatus.PENDING,
          subtotal: +subtotal.toFixed(2),
          discountAmount: +discountAmount.toFixed(2),
          shippingCost,
          tax,
          total,
          couponCode: dto.couponCode || null,
          notes: dto.notes || null,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.product.price,
            })),
          },
        },
        include: { items: { include: { product: true } }, address: true },
      });

      // Decrement stock atomically (race-condition safe)
      for (const item of cart.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } },
        });
        if (updated.count === 0) {
          throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
        }
      }

      // Increment coupon usage
      if (dto.couponCode) {
        await tx.coupon.update({
          where: { code: dto.couponCode },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    return order;
  }

  async findAll(user: User, pagination: PaginationDto) {
    const { page = 1, limit = 12 } = pagination;
    const skip = (page - 1) * limit;

    const where = user.role === Role.ADMIN ? {} : { userId: user.id };

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          items: { include: { product: { select: { id: true, name: true, imageUrls: true } } } },
          address: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: string, user: User) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        address: true,
      },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (user.role !== Role.ADMIN && order.userId !== user.id) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(id: string, newStatus: OrderStatus) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${newStatus}`,
      );
    }

    return this.prisma.order.update({ where: { id }, data: { status: newStatus } });
  }

  async cancel(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Access denied');

    if (!([OrderStatus.PENDING, OrderStatus.CONFIRMED] as OrderStatus[]).includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id }, data: { status: OrderStatus.CANCELLED } });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      // Restore coupon usage if it was applied
      if (order.couponCode) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usageCount: { decrement: 1 } },
        });
      }
    });

    return this.prisma.order.findUnique({ where: { id } });
  }

  private async generateOrderNumber(): Promise<string> {
    // Use timestamp + random suffix to ensure uniqueness without race conditions
    const year = new Date().getFullYear();
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `ORD-${year}-${String(timestamp).slice(-8)}-${String(random).padStart(4, '0')}`;
  }
}
