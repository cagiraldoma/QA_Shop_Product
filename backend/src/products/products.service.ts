import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { paginate } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 12, search, category, minPrice, maxPrice, featured, inStock, sortBy, order } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && {
        category: {
          OR: [{ slug: category }, { parent: { slug: category } }],
        },
      }),
      ...(minPrice !== undefined || maxPrice !== undefined
        ? {
            price: {
              ...(minPrice !== undefined && { gte: minPrice }),
              ...(maxPrice !== undefined && { lte: maxPrice }),
            },
          }
        : {}),
      ...(featured !== undefined && { isFeatured: featured }),
      ...(inStock && { stock: { gt: 0 } }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sortBy === 'price'
        ? { price: order || 'asc' }
        : sortBy === 'rating'
          ? { avgRating: order || 'desc' }
          : sortBy === 'name'
            ? { name: order || 'asc' }
            : { createdAt: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { category: { select: { id: true, name: true, slug: true } } },
      }),
      this.prisma.product.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        reviews: {
          where: { isVisible: true },
          include: { user: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } } },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!product || !product.isActive) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        comparePrice: dto.comparePrice ?? null,
        stock: dto.stock ?? 0,
        sku: dto.sku,
        imageUrls: dto.imageUrls ?? [],
        isFeatured: dto.isFeatured ?? false,
        categoryId: dto.categoryId,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  async update(id: string, dto: Partial<CreateProductDto>) {
    await this.ensureExists(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.product.update({ where: { id }, data: { isActive: false } });
    return { message: 'Product deactivated' };
  }

  async updateStock(id: string, stock: number) {
    await this.ensureExists(id);
    return this.prisma.product.update({ where: { id }, data: { stock } });
  }

  private async ensureExists(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }
}
