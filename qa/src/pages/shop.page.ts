import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ShopPage extends BasePage {
  readonly searchInput: Locator;
  readonly productGrid: Locator;
  readonly filterSidebar: Locator;
  readonly pagination: Locator;
  readonly resultsCount: Locator;
  readonly emptyResults: Locator;
  readonly clearFiltersButton: Locator;
  readonly minPriceInput: Locator;
  readonly maxPriceInput: Locator;
  readonly sortSelect: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.locator('[data-testid="search-input"]');
    this.productGrid = page.locator('[data-testid="product-grid"]');
    this.filterSidebar = page.locator('[data-testid="filter-sidebar"]');
    this.pagination = page.locator('[data-testid="pagination"]');
    this.resultsCount = page.locator('[data-testid="results-count"]');
    this.emptyResults = page.locator('[data-testid="empty-results"]');
    this.clearFiltersButton = page.locator('[data-testid="clear-filters-button"]');
    this.minPriceInput = page.locator('[data-testid="min-price-input"]');
    this.maxPriceInput = page.locator('[data-testid="max-price-input"]');
    this.sortSelect = page.locator('[data-testid="sort-select"]');
  }

  async searchProducts(term: string): Promise<void> {
    await this.searchInput.fill(term);
  }

  async selectCategory(slug: string): Promise<void> {
    const categoryButton = this.page.locator(`[data-testid="category-filter-${slug}"]`);
    await categoryButton.click();
  }

  async setPriceRange(min: number, max: number): Promise<void> {
    await this.minPriceInput.fill(String(min));
    await this.maxPriceInput.fill(String(max));
  }

  async getProductCount(): Promise<number> {
    const cards = this.page.locator('[data-testid="product-card"]');
    return cards.count();
  }

  async goToPage(n: number): Promise<void> {
    // Update URL query param directly for reliable page navigation
    const currentUrl = new URL(this.page.url());
    currentUrl.searchParams.set('page', String(n));
    await this.goto(currentUrl.toString());
  }

  async clickNextPage(): Promise<void> {
    const nextButton = this.page.locator('[data-testid="pagination-next"]');
    await nextButton.click();
  }

  async clickPreviousPage(): Promise<void> {
    const prevButton = this.page.locator('[data-testid="pagination-prev"]');
    await prevButton.click();
  }

  async getResultsCountText(): Promise<string> {
    return this.resultsCount.innerText();
  }
}
