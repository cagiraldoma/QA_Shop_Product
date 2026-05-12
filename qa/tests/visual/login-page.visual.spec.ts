import { test, expect } from '@playwright/test';
import { config } from '@config/config';

test.describe('@visual Login Page', () => {
  test('login page matches baseline', async ({ page }) => {
    await page.goto(`${config.BASE_URL}/login`);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.001,
      mask: [page.locator('[data-testid="login-error"]')],
    });
  });
});
