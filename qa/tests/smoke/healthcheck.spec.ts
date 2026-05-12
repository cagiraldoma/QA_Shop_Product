import { test, expect } from '@playwright/test';
import { config } from '@config/config';

test.describe('@smoke Health Checks', () => {
  test('frontend loads within 2 seconds', async ({ page }) => {
    const start = Date.now();
    await page.goto(config.BASE_URL);
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(2000);
  });

  test('API health endpoint responds', async ({ request }) => {
    const response = await request.get(`${config.API_BASE_URL}/health`);
    expect(response.ok()).toBeTruthy();
  });
});
