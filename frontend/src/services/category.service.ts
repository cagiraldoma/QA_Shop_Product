import api from './api';
import type { Category } from '../types/product.types';

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get<{ success: boolean; data: Category[] }>('/categories');
    return res.data.data;
  },

  getBySlug: async (slug: string): Promise<Category> => {
    const res = await api.get<{ success: boolean; data: Category }>(`/categories/${slug}`);
    return res.data.data;
  },

  create: async (data: Partial<Category>): Promise<Category> => {
    const res = await api.post<{ success: boolean; data: Category }>('/categories', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await api.patch<{ success: boolean; data: Category }>(`/categories/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
