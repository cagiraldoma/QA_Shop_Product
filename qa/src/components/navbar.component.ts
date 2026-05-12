import { Page, Locator, expect } from '@playwright/test';

export class NavbarComponent {
  private readonly logo: Locator;
  private readonly shopLink: Locator;
  private readonly adminLink: Locator;
  private readonly cartButton: Locator;
  private readonly cartCount: Locator;
  private readonly profileLink: Locator;
  private readonly loginLink: Locator;
  private readonly logoutButton: Locator;

  constructor(private page: Page) {
    this.logo = page.locator('[data-testid="navbar-logo"]');
    this.shopLink = page.locator('[data-testid="navbar-shop-link"]');
    this.adminLink = page.locator('[data-testid="navbar-admin-link"]');
    this.cartButton = page.locator('[data-testid="navbar-cart-button"]');
    this.cartCount = page.locator('[data-testid="navbar-cart-count"]');
    this.profileLink = page.locator('[data-testid="navbar-profile-link"]');
    this.loginLink = page.locator('[data-testid="navbar-login-link"]');
    this.logoutButton = page.locator('[data-testid="navbar-logout-button"]');
  }

  async navigateToShop(): Promise<void> {
    await this.shopLink.click();
  }

  async navigateToAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  async openCart(): Promise<void> {
    await this.cartButton.click();
  }

  async navigateToProfile(): Promise<void> {
    await this.profileLink.click();
  }

  async clickLogout(): Promise<void> {
    await this.logoutButton.click();
  }

  async clickLogin(): Promise<void> {
    await this.loginLink.click();
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.logoutButton).toBeVisible();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.loginLink).toBeVisible();
  }

  async getCartCount(): Promise<string | null> {
    if (await this.cartCount.isVisible().catch(() => false)) {
      return this.cartCount.innerText();
    }
    return null;
  }
}
