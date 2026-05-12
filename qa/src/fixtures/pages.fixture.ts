
import { baseTest } from './base.fixture';
import { LoginPage, ShopPage, CartPage, CheckoutPage, DashboardPage } from '@pages/index';
import { NavbarComponent, ProductCardComponent, PaginationComponent } from '@pages/index';

export interface PagesFixtures {
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  dashboardPage: DashboardPage;
  navbar: NavbarComponent;
  productCard: ProductCardComponent;
  pagination: PaginationComponent;
}

export const pagesTest = baseTest.extend<PagesFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  shopPage: async ({ page }, use) => {
    await use(new ShopPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  navbar: async ({ page }, use) => {
    await use(new NavbarComponent(page));
  },
  productCard: async ({ page }, use) => {
    await use(new ProductCardComponent(page));
  },
  pagination: async ({ page }, use) => {
    await use(new PaginationComponent(page));
  },
});
