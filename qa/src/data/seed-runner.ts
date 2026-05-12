import { ApiClient } from '@api/api-client';
import { AuthEndpoint, UsersEndpoint, ProductsEndpoint, OrdersEndpoint } from '@api/index';
import { Product, User } from '@domain-types/index';
import { UserFactory } from './factories/user.factory';
import { ProductFactory } from './factories/product.factory';
import { testLogger } from '@utils/logger';

export interface SeededData {
  admin: { user: unknown; token: string };
  customer: { user: unknown; token: string };
  products: unknown[];
}

export class SeedRunner {
  private usersEndpoint: UsersEndpoint;
  private productsEndpoint: ProductsEndpoint;
  private ordersEndpoint: OrdersEndpoint;
  private authEndpoint: AuthEndpoint;
  private createdUserIds: string[] = [];
  private createdProductIds: string[] = [];
  private createdOrderIds: string[] = [];

  constructor(private apiClient: ApiClient) {
    this.authEndpoint = new AuthEndpoint(apiClient);
    this.usersEndpoint = new UsersEndpoint(apiClient);
    this.productsEndpoint = new ProductsEndpoint(apiClient);
    this.ordersEndpoint = new OrdersEndpoint(apiClient);
  }

  async seedAdmin(email: string, password: string): Promise<{ user: unknown; token: string }> {
    try {
      const result = await this.authEndpoint.login({ email, password });
      this.apiClient.setAuthToken(result.token);
      return { user: result.user, token: result.token };
    } catch {
      const userData = UserFactory.build({ email, password, role: 'admin', firstName: 'Admin', lastName: 'User' });
      const user = await this.usersEndpoint.create(userData);
      this.createdUserIds.push((user as User).id);
      const result = await this.authEndpoint.login({ email, password });
      this.apiClient.setAuthToken(result.token);
      return { user, token: result.token };
    }
  }

  async seedCustomer(email: string, password: string): Promise<{ user: unknown; token: string }> {
    try {
      const result = await this.authEndpoint.login({ email, password });
      return { user: result.user, token: result.token };
    } catch {
      const userData = UserFactory.build({ email, password, role: 'customer', firstName: 'Test', lastName: 'Customer' });
      const user = await this.usersEndpoint.create(userData);
      this.createdUserIds.push((user as User).id);
      const result = await this.authEndpoint.login({ email, password });
      return { user, token: result.token };
    }
  }

  async seedProducts(count: number = 5): Promise<unknown[]> {
    const products = [];
    for (let i = 0; i < count; i++) {
      const data = ProductFactory.build();
      const product = await this.productsEndpoint.create(data);
      products.push(product);
      this.createdProductIds.push((product as Product).id);
    }
    return products;
  }

  async cleanup(): Promise<void> {
    testLogger.info(`Cleaning up ${this.createdOrderIds.length} orders, ${this.createdProductIds.length} products, ${this.createdUserIds.length} users`);
    
    for (const id of this.createdOrderIds) {
      try { await this.ordersEndpoint.delete(id); } catch { /* ignore */ }
    }
    for (const id of this.createdProductIds) {
      try { await this.productsEndpoint.delete(id); } catch { /* ignore */ }
    }
    for (const id of this.createdUserIds) {
      try { await this.usersEndpoint.delete(id); } catch { /* ignore */ }
    }
  }

  trackUserId(id: string): void {
    this.createdUserIds.push(id);
  }

  trackProductId(id: string): void {
    this.createdProductIds.push(id);
  }

  trackOrderId(id: string): void {
    this.createdOrderIds.push(id);
  }
}
