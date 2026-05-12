import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';

export class DashboardPage extends BasePage {
  readonly statsGrid: Locator;
  readonly statTotalOrders: Locator;
  readonly statTotalProducts: Locator;
  readonly statTotalUsers: Locator;
  readonly recentOrders: Locator;
  readonly recentOrdersTable: Locator;
  readonly viewAllOrdersLink: Locator;

  constructor(page: Page) {
    super(page);
    this.statsGrid = page.locator('[data-testid="dashboard-stats"]');
    this.statTotalOrders = page.locator('[data-testid="stat-total-orders"]');
    this.statTotalProducts = page.locator('[data-testid="stat-total-products"]');
    this.statTotalUsers = page.locator('[data-testid="stat-total-users"]');
    this.recentOrders = page.locator('[data-testid="recent-orders"]');
    this.recentOrdersTable = page.locator('[data-testid="recent-orders-table"]');
    this.viewAllOrdersLink = page.locator('[data-testid="view-all-orders-link"]');
  }

  async toBeOnDashboard(): Promise<void> {
    await expect(this.page.locator('[data-testid="admin-dashboard-page"]')).toBeVisible();
  }

  async getStatTotalOrders(): Promise<string> {
    return this.statTotalOrders.innerText();
  }

  async getStatTotalProducts(): Promise<string> {
    return this.statTotalProducts.innerText();
  }

  async getStatTotalUsers(): Promise<string> {
    return this.statTotalUsers.innerText();
  }

  async viewAllOrders(): Promise<void> {
    await this.viewAllOrdersLink.click();
  }

  async getRecentOrderRowsCount(): Promise<number> {
    return this.page.locator('[data-testid="recent-order-row"]').count();
  }
}
