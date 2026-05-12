import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(protected page: Page) {}

  async goto(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  async toHaveUrl(url: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(url);
  }

  async toHaveTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png` });
  }

  findByTestId(testId: string): Locator {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  findByRole(role: string, name?: string): Locator {
    return this.page.getByRole(role as never, name ? { name } : undefined);
  }

  findByText(text: string): Locator {
    return this.page.getByText(text);
  }
}
