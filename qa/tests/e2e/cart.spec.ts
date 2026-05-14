import { test, expect } from '@fixtures/index';
import { config } from '@config/config';

test.describe('@e2e @smoke Cart', () => {
  test('user can add a product to cart', async ({ shopPage, cartPage, productCard }) => {
    await shopPage.goto(`${config.BASE_URL}/shop`);
    await shopPage.waitForLoad();
    await productCard.addToCart();
    // await loginPage.login(`${config.CUSTOMER_EMAIL}`, `${config.CUSTOMER_PASSWORD}`);
    await cartPage.goto(`${config.BASE_URL}/cart`);

    await cartPage.waitForLoad();
    await cartPage.toBeOnCartPage();
    const count = await cartPage.getCartItemsCount();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});
