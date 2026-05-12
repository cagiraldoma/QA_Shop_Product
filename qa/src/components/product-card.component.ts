import { Page, Locator } from '@playwright/test';

export class ProductCardComponent {
  readonly card: Locator;
  readonly image: Locator;
  readonly name: Locator;
  readonly price: Locator;
  readonly addToCartButton: Locator;
  readonly outOfStockBadge: Locator;
  readonly saleBadge: Locator;
  readonly lowStockText: Locator;

  constructor(private page: Page, index: number = 0) {
    this.card = page.locator('[data-testid="product-card"]').nth(index);
    this.image = this.card.locator('[data-testid="product-card-image"]');
    this.name = this.card.locator('[data-testid="product-card-name"]');
    this.price = this.card.locator('[data-testid="product-card-price"]');
    this.addToCartButton = this.card.locator('[data-testid="product-card-add-to-cart"]');
    this.outOfStockBadge = this.card.locator('[data-testid="product-card-out-of-stock"]');
    this.saleBadge = this.card.locator('[data-testid="product-card-sale-badge"]');
    this.lowStockText = this.card.locator('[data-testid="product-card-low-stock"]');
  }

  static byProductId(page: Page, productId: string): ProductCardComponent {
    const card = page.locator(`[data-testid="product-card"][data-product-id="${productId}"]`);
    const component = Object.create(ProductCardComponent.prototype);
    component.page = page;
    component.card = card;
    component.image = card.locator('[data-testid="product-card-image"]');
    component.name = card.locator('[data-testid="product-card-name"]');
    component.price = card.locator('[data-testid="product-card-price"]');
    component.addToCartButton = card.locator('[data-testid="product-card-add-to-cart"]');
    component.outOfStockBadge = card.locator('[data-testid="product-card-out-of-stock"]');
    component.saleBadge = card.locator('[data-testid="product-card-sale-badge"]');
    component.lowStockText = card.locator('[data-testid="product-card-low-stock"]');
    return component;
  }

  async getName(): Promise<string> {
    return this.name.innerText();
  }

  async getPrice(): Promise<string> {
    return this.price.innerText();
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async isOutOfStock(): Promise<boolean> {
    return this.outOfStockBadge.isVisible().catch(() => false);
  }

  async isOnSale(): Promise<boolean> {
    return this.saleBadge.isVisible().catch(() => false);
  }

  async click(): Promise<void> {
    await this.card.click();
  }
}
