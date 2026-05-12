import { test, expect } from '@playwright/test';
import { config } from '@config/config';

test.describe('@api sanity checks', () => {
  test('API health endpoint responds with 200', async ({ request }) => {
    const response = await request.get(`${config.API_BASE_URL}/health`);
    expect(response.ok()).toBeTruthy();
  });

  test('frontend loads successfully', async ({ request }) => {
    const response = await request.get(config.BASE_URL);
    expect(response.ok()).toBeTruthy();
  });
});
