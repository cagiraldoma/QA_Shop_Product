import { authTest } from './auth.fixture';
import { ApiClient, AuthEndpoint, UsersEndpoint, ProductsEndpoint, OrdersEndpoint, CategoriesEndpoint } from '@api/index';
import { request } from '@playwright/test';
import { config } from '@config/config';
import * as fs from 'fs';
import * as path from 'path';

function loadToken(filename: string): string | undefined {
  const tokenPath = path.join(process.cwd(), 'storageState', filename);
  if (!fs.existsSync(tokenPath)) return undefined;
  const content = JSON.parse(fs.readFileSync(tokenPath, 'utf-8'));
  return content.token;
}

export interface ApiFixtures {
  apiClient: ApiClient;
  adminApiClient: ApiClient;
  customerApiClient: ApiClient;
  authEndpoint: AuthEndpoint;
  usersEndpoint: UsersEndpoint;
  productsEndpoint: ProductsEndpoint;
  ordersEndpoint: OrdersEndpoint;
  categoriesEndpoint: CategoriesEndpoint;
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
  adminApiClient: async ({}, use) => {
    const reqContext = await request.newContext({
      baseURL: config.API_BASE_URL,
    });
    const client = new ApiClient(reqContext, config.API_BASE_URL);
    const token = loadToken('admin-token.json');
    if (token) client.setAuthToken(token);
    await use(client);
    await reqContext.dispose();
  },
  customerApiClient: async ({}, use) => {
    const reqContext = await request.newContext({
      baseURL: config.API_BASE_URL,
    });
    const client = new ApiClient(reqContext, config.API_BASE_URL);
    const token = loadToken('customer-token.json');
    if (token) client.setAuthToken(token);
    await use(client);
    await reqContext.dispose();
  },
  authEndpoint: async ({ apiClient }, use) => {
    await use(new AuthEndpoint(apiClient));
  },
  usersEndpoint: async ({ adminApiClient }, use) => {
    await use(new UsersEndpoint(adminApiClient));
  },
  productsEndpoint: async ({ adminApiClient }, use) => {
    await use(new ProductsEndpoint(adminApiClient));
  },
  ordersEndpoint: async ({ customerApiClient }, use) => {
    await use(new OrdersEndpoint(customerApiClient));
  },
  categoriesEndpoint: async ({ adminApiClient }, use) => {
    await use(new CategoriesEndpoint(adminApiClient));
  },
});
