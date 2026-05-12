import { Product } from '@domain-types/index';

export type ProductBuildResult = Partial<Product> & {
  categoryId?: string;
  featured?: boolean;
};

export class ProductBuilder {
  private name: string = 'Test Product';
  private price: string = '99.99';
  private stock: number = 10;
  private categoryId: string | undefined = undefined;
  private description: string = 'A test product description';
  private featured: boolean = false;

  withName(name: string): this {
    this.name = name;
    return this;
  }

  withPrice(price: string): this {
    this.price = price;
    return this;
  }

  withStock(stock: number): this {
    this.stock = stock;
    return this;
  }

  withCategoryId(categoryId: string): this {
    this.categoryId = categoryId;
    return this;
  }

  withDescription(description: string): this {
    this.description = description;
    return this;
  }

  withFeatured(featured: boolean): this {
    this.featured = featured;
    return this;
  }

  build(): ProductBuildResult {
    return {
      name: this.name,
      price: this.price,
      stock: this.stock,
      categoryId: this.categoryId,
      description: this.description,
      featured: this.featured,
      sku: 'TEST-SKU',
      imageUrls: [],
      isActive: true,
      isFeatured: this.featured,
      avgRating: 0,
      reviewCount: 0,
    };
  }
}
