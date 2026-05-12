import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly formContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('[data-testid="login-email-input"]');
    this.passwordInput = page.locator('[data-testid="login-password-input"]');
    this.submitButton = page.locator('[data-testid="login-submit-button"]');
    this.errorMessage = page.locator('[data-testid="login-error"]');
    this.forgotPasswordLink = page.locator('[data-testid="forgot-password-link"]');
    this.registerLink = page.locator('[data-testid="register-link"]');
    this.formContainer = page.locator('[data-testid="login-form-container"]');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async toBeOnLoginPage(): Promise<void> {
    await expect(this.formContainer).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }
}
