import api from './api';
import type { Product, ProductFilters } from '../types/product.types';
import type { PaginatedResponse } from '../types/api.types';

export const productService = {
  getAll: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });
    const res = await api.get<{ success: boolean; data: PaginatedResponse<Product> }>(
      `/products?${params.toString()}`,
    );
    return res.data.data;
  },

  getBySlug: async (slug: string): Promise<Product> => {
    const res = await api.get<{ success: boolean; data: Product }>(`/products/${slug}`);
    return res.data.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post<{ success: boolean; data: Product }>('/products', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await api.patch<{ success: boolean; data: Product }>(`/products/${id}`, data);
    return res.data.data;
  },

  updateStock: async (id: string, stock: number): Promise<Product> => {
    const res = await api.patch<{ success: boolean; data: Product }>(`/products/${id}/stock`, { stock });
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
