# Testing Guide

## E2E Tests

```ts
import { test, expect } from '@fixtures/index';

test.describe('@e2e @smoke Checkout', () => {
  test('customer can complete checkout', async ({ shopPage, cartPage, checkoutPage, authenticatedPage }) => {
    await authenticatedPage.goto('/shop');
    await shopPage.addFirstProductToCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderConfirmation();
  });
});
```

## API Tests

```ts
import { test, expect } from '@fixtures/index';

test.describe('@api Products', () => {
  test('can create product', async ({ productsEndpoint, productFactory, cleanupTracker }) => {
    const data = productFactory.build();
    const product = await productsEndpoint.create(data);
    cleanupTracker.track('products', product.id);
    expect(product.name).toBe(data.name);
  });
});
```

## Visual Tests

```ts
import { test, expect } from '@playwright/test';

test('homepage matches baseline', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixelRatio: 0.001,
  });
});
```

Run visual tests: `npm run test:visual`
Update baselines: `npx playwright test --update-snapshots`

## Smoke Tests

Keep under 2 minutes total. Focus on:
- Login
- Product search
- Add to cart
- Checkout
- API health
