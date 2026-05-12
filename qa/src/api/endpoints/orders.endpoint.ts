import { ApiClient } from '../api-client';
import { Order } from '@domain-types/index';

export class OrdersEndpoint {
  constructor(private client: ApiClient) {}

  async list(query?: { page?: number; limit?: number; status?: string }): Promise<{ data: Order[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.status) params.set('status', query.status);
    const res = await this.client.get<{ data: Order[]; total: number; page: number; totalPages: number }>(`/orders?${params.toString()}`);
    return res.data;
  }

  async getById(id: string): Promise<Order> {
    const res = await this.client.get<Order>(`/orders/${id}`);
    return res.data;
  }

  async create(payload: Partial<Order>): Promise<Order> {
    const res = await this.client.post<Order>('/orders', payload);
    return res.data;
  }

  async update(id: string, payload: Partial<Order>): Promise<Order> {
    const res = await this.client.patch<Order>(`/orders/${id}`, payload);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<void>(`/orders/${id}`);
  }
}
