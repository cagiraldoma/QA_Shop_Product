import { ApiClient } from '../api-client';

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export class CategoriesEndpoint {
  constructor(private client: ApiClient) {}

  async list(): Promise<Category[]> {
    const res = await this.client.get<{ data: Category[] }>('/categories');
    return res.data;
  }
}
