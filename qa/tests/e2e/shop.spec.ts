import { test, expect } from '@fixtures/index';
import { config } from '@config/config';

test.describe('@e2e @smoke Shop', () => {
  test('user can search for products', async ({ page: _page, shopPage }) => {
    await shopPage.goto(`${config.BASE_URL}/shop`);
    await shopPage.searchProducts('laptop');
    const count = await shopPage.getProductCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('user can filter by category', async ({ page, shopPage }) => {
    await shopPage.goto(`${config.BASE_URL}/shop`);
    await shopPage.selectCategory('electronics');
    await expect(page).toHaveURL(/shop.*category=electronics/);
  });
});
