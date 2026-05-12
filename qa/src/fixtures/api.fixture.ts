import { authTest } from './auth.fixture';
import { ApiClient, AuthEndpoint, UsersEndpoint, ProductsEndpoint, OrdersEndpoint } from '@api/index';
import { request } from '@playwright/test';
import { config } from '@config/config';

export interface ApiFixtures {
  apiClient: ApiClient;
  authEndpoint: AuthEndpoint;
  usersEndpoint: UsersEndpoint;
  productsEndpoint: ProductsEndpoint;
  ordersEndpoint: OrdersEndpoint;
}

export const apiTest = authTest.extend<ApiFixtures>({
  apiClient: async ({}, use) => {
    const reqContext = await request.newContext({
      baseURL: config.API_BASE_URL,
    });
    const client = new ApiClient(reqContext, config.API_BASE_URL);
    await use(client);
    await reqContext.dispose();
  },
  authEndpoint: async ({ apiClient }, use) => {
    await use(new AuthEndpoint(apiClient));
  },
  usersEndpoint: async ({ apiClient }, use) => {
    await use(new UsersEndpoint(apiClient));
  },
  productsEndpoint: async ({ apiClient }, use) => {
    await use(new ProductsEndpoint(apiClient));
  },
  ordersEndpoint: async ({ apiClient }, use) => {
    await use(new OrdersEndpoint(apiClient));
  },
});
