import { faker } from '@faker-js/faker';

faker.seed(12345);

export interface ProductOverrides {
  name?: string;
  price?: number;
  stock?: number;
  categoryId?: string;
  description?: string;
  isFeatured?: boolean;
  slug?: string;
  sku?: string;
}

export interface ProductCreatePayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  stock?: number;
  sku: string;
  imageUrls?: string[];
  isFeatured?: boolean;
  categoryId: string;
}

export class ProductFactory {
  static build(overrides: ProductOverrides = {}): ProductCreatePayload {
    const name = overrides.name ?? faker.commerce.productName();
    const baseSlug = faker.helpers.slugify(name).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    return {
      name,
      slug: overrides.slug ?? `${baseSlug}-${uniqueSuffix}`,
      description: overrides.description ?? faker.commerce.productDescription(),
      price: overrides.price ?? faker.number.int({ min: 10, max: 1000 }),
      stock: overrides.stock ?? faker.number.int({ min: 1, max: 100 }),
      sku: overrides.sku ?? `${faker.string.alphanumeric(4).toUpperCase()}-${uniqueSuffix}`,
      imageUrls: [faker.image.urlPicsumPhotos()],
      isFeatured: overrides.isFeatured ?? false,
      categoryId: overrides.categoryId ?? faker.string.uuid(),
    };
  }

  static buildMany(count: number, overrides: ProductOverrides = {}): ProductCreatePayload[] {
    return Array.from({ length: count }, () => ProductFactory.build(overrides));
  }
}
