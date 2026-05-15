import { ApiClient } from '../api-client';
import { User } from '@domain-types/index';

export class UsersEndpoint {
  constructor(private client: ApiClient) {}

  async list(query?: { page?: number; limit?: number; role?: string }): Promise<{ data: User[]; total: number; page: number; totalPages: number }> {
    const params = new URLSearchParams();
    if (query?.page) params.set('page', String(query.page));
    if (query?.limit) params.set('limit', String(query.limit));
    if (query?.role) params.set('role', query.role);
    const res = await this.client.get<{ data: User[]; total: number; page: number; totalPages: number }>(`/users?${params.toString()}`);
    return res.data;
  }

  async getById(id: string): Promise<User> {
    const res = await this.client.get<User>(`/users/${id}`);
    return res.data;
  }

  async create(payload: Partial<User>): Promise<User> {
    const registerPayload = {
      email: payload.email,
      password: payload.password,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
    const res = await this.client.post<{ accessToken: string; user: User }>('/auth/register', registerPayload);
    return res.data.user;
  }

  async update(id: string, payload: Partial<User>): Promise<User> {
    const res = await this.client.patch<User>(`/users/${id}`, payload);
    return res.data;
  }

  async delete(id: string): Promise<void> {
    await this.client.delete<void>(`/users/${id}`);
  }
}
