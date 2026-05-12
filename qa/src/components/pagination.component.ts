import { Page, Locator, expect } from '@playwright/test';

export class PaginationComponent {
  readonly container: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly pageInfo: Locator;

  constructor(private page: Page) {
    this.container = page.locator('[data-testid="pagination"]');
    this.prevButton = page.locator('[data-testid="pagination-prev"]');
    this.nextButton = page.locator('[data-testid="pagination-next"]');
    this.pageInfo = page.locator('[data-testid="pagination-info"]');
  }

  async clickNext(): Promise<void> {
    await this.nextButton.click();
  }

  async clickPrevious(): Promise<void> {
    await this.prevButton.click();
  }

  async getPageInfo(): Promise<string> {
    // eslint-disable-next-line playwright/prefer-locator
    return this.pageInfo.innerText();
  }

  async isNextEnabled(): Promise<boolean> {
    const disabled = await this.nextButton.getAttribute('disabled').catch(() => null);
    return disabled === null;
  }

  async isPreviousEnabled(): Promise<boolean> {
    const disabled = await this.prevButton.getAttribute('disabled').catch(() => null);
    return disabled === null;
  }

  async toBeVisible(): Promise<void> {
    await expect(this.container).toBeVisible();
  }
}
