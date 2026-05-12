import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly cartItem: Locator;
  readonly cartSummary: Locator;
  readonly subtotal: Locator;
  readonly discount: Locator;
  readonly shipping: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingLink: Locator;
  readonly emptyCart: Locator;
  readonly cartLoginPrompt: Locator;
  readonly cartLoginButton: Locator;
  readonly emptyCartShopButton: Locator;
  readonly cartItemCount: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-testid="cart-items"]');
    this.cartItem = page.locator('[data-testid="cart-item"]');
    this.cartSummary = page.locator('[data-testid="cart-summary"]');
    this.subtotal = page.locator('[data-testid="cart-subtotal"]');
    this.discount = page.locator('[data-testid="cart-discount"]');
    this.shipping = page.locator('[data-testid="cart-shipping"]');
    this.tax = page.locator('[data-testid="cart-tax"]');
    this.total = page.locator('[data-testid="cart-total"]');
    this.checkoutButton = page.locator('[data-testid="checkout-button"]');
    this.continueShoppingLink = page.locator('[data-testid="continue-shopping-link"]');
    this.emptyCart = page.locator('[data-testid="empty-cart"]');
    this.cartLoginPrompt = page.locator('[data-testid="cart-login-prompt"]');
    this.cartLoginButton = page.locator('[data-testid="cart-login-button"]');
    this.emptyCartShopButton = page.locator('[data-testid="empty-cart-shop-button"]');
    this.cartItemCount = page.locator('[data-testid="cart-item-count"]');
  }

  async getCartItemsCount(): Promise<number> {
    return this.cartItem.count();
  }

  async removeItem(index: number): Promise<void> {
    const removeButton = this.cartItem.nth(index).locator('[data-testid="cart-item-remove"]');
    await removeButton.click();
  }

  async getItemTotal(index: number): Promise<string> {
    return this.cartItem.nth(index).locator('[data-testid="cart-item-total"]').innerText();
  }

  async getItemName(index: number): Promise<string> {
    return this.cartItem.nth(index).locator('[data-testid="cart-item-name"]').innerText();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async toBeOnCartPage(): Promise<void> {
    await expect(this.page.locator('[data-testid="cart-page"]')).toBeVisible();
  }

  async toBeEmpty(): Promise<void> {
    await expect(this.emptyCart).toBeVisible();
  }

  async toRequireLogin(): Promise<void> {
    await expect(this.cartLoginPrompt).toBeVisible();
  }
}
