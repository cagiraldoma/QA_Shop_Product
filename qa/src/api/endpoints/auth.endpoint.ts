import { ApiClient } from '../api-client';
import { LoginRequest, LoginResponse } from '../types';

export class AuthEndpoint {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const res = await this.client.post<LoginResponse>('/auth/login', credentials);
    return res.data;
  }

  async logout(): Promise<void> {
    await this.client.post<void>('/auth/logout', {});
  }

  async register(data: { email: string; password: string; firstName: string; lastName: string }): Promise<LoginResponse> {
    const res = await this.client.post<LoginResponse>('/auth/register', data);
    return res.data;
  }
}
