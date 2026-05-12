import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/create-review.dto';
import { OrderStatus, Role, User } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async getProductReviews(productId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    return this.prisma.review.findMany({
      where: { productId, isVisible: true },
      include: {
        user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(user: User, dto: CreateReviewDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    // Must have a delivered order containing the product
    const eligibleOrder = await this.prisma.order.findFirst({
      where: {
        userId: user.id,
        status: OrderStatus.DELIVERED,
        items: { some: { productId: dto.productId } },
      },
    });

    if (!eligibleOrder) {
      throw new BadRequestException('You must purchase and receive this product before reviewing');
    }

    const existing = await this.prisma.review.findUnique({
      where: { userId_productId: { userId: user.id, productId: dto.productId } },
    });
    if (existing) throw new BadRequestException('You have already reviewed this product');

    const review = await this.prisma.review.create({
      data: {
        userId: user.id,
        productId: dto.productId,
        rating: dto.rating,
        title: dto.title,
        body: dto.body,
      },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
    });

    await this.updateProductRating(dto.productId);

    return review;
  }

  async update(id: string, user: User, dto: UpdateReviewDto) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (review.userId !== user.id) throw new ForbiddenException('Cannot edit this review');

    const updated = await this.prisma.review.update({ where: { id }, data: dto });
    await this.updateProductRating(review.productId);
    return updated;
  }

  async remove(id: string, user: User) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review not found');
    if (user.role !== Role.ADMIN && review.userId !== user.id) {
      throw new ForbiddenException('Cannot delete this review');
    }

    await this.prisma.review.delete({ where: { id } });
    await this.updateProductRating(review.productId);
    return { message: 'Review deleted' };
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isVisible: true },
      select: { rating: true },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await this.prisma.product.update({
      where: { id: productId },
      data: { avgRating: +avgRating.toFixed(1), reviewCount: reviews.length },
    });
  }
}
