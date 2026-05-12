import { faker } from '@faker-js/faker';
import { Product } from '@domain-types/index';

faker.seed(12345);

export interface ProductOverrides {
  name?: string;
  price?: string;
  stock?: number;
  categoryId?: string;
  description?: string;
  featured?: boolean;
}

export type ProductBuildResult = Partial<Product> & {
  categoryId?: string;
  featured?: boolean;
};

export class ProductFactory {
  static build(overrides: ProductOverrides = {}): ProductBuildResult {
    return {
      name: overrides.name ?? faker.commerce.productName(),
      price: overrides.price ?? String(faker.number.int({ min: 10, max: 1000 })),
      stock: overrides.stock ?? faker.number.int({ min: 1, max: 100 }),
      categoryId: overrides.categoryId,
      description: overrides.description ?? faker.commerce.productDescription(),
      featured: overrides.featured ?? false,
      sku: faker.string.alphanumeric(8).toUpperCase(),
      imageUrls: [faker.image.urlPicsumPhotos()],
      isActive: true,
      isFeatured: overrides.featured ?? false,
      avgRating: 0,
      reviewCount: 0,
    };
  }

  static buildMany(count: number, overrides: ProductOverrides = {}): ProductBuildResult[] {
    return Array.from({ length: count }, () => ProductFactory.build(overrides));
  }
}
