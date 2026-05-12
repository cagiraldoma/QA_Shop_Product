import { ApiClient } from '../api-client';
import { Product, ProductFilters } from '@domain-types/index';

export class ProductsEndpoint {
  constructor(private client: ApiClient) {}

  async list(query?: ProductFilters): Promise<{ data: Product[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (query?.search) params.set('search', query.search);
    if (query?.category) params.set('category', query.category);
    if (query?.minPrice !== undefined) params.set('minPrice', String(query.minPrice));
    if (query?.maxPrice !== undefined) params.set('maxPrice', String(query.maxPrice));
    if (query?.featured !== undefined) params.set('featured', String(query.featured));
    if (query?.inStock !== undefined) params.set('inStock', String(query.inStock));
    if (query?.sortBy) params.set('sortBy', query.sortBy);
    if (query?.order) params.set('order', query.order);
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    const res = await this.client.get<{ data: Product[]; total: number; page: number; totalPages: number }>(`/products?${params.toString()}`);
    return res.data;
  }

  async getById(id: string): Promise<Product> {
    const res = await this.client.get<Product>(`/products/${id}`);
    return res.data;
  }

  async create(payload: Partial<Product>): Promise<Product> {
    const res = await this.client.post<Product>('/products', payload);
    return res.data;
  }

  async update(id: string, payload: Partial<Product>): Promise<Product> {
    const res = await this.client.patch<Product>(`/products/${id}`, payload);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<void>(`/products/${id}`);
  }
}
