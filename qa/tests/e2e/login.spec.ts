import { test, expect } from '@fixtures/index';
import { config } from '@config/config';

test.describe('@e2e @smoke Authentication', () => {
  test('user can log in with valid credentials', async ({ page: _page, loginPage }) => {
    await loginPage.goto(`${config.BASE_URL}/login`);
    await loginPage.login(config.CUSTOMER_EMAIL, config.CUSTOMER_PASSWORD);
    await loginPage.toHaveUrl(/\/profile|\//);
  });

  test('user sees error with invalid credentials', async ({ page: _page, loginPage }) => {
    await loginPage.goto(`${config.BASE_URL}/login`);
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await expect(loginPage.errorMessage).toContainText('Invalid');
  });
});
