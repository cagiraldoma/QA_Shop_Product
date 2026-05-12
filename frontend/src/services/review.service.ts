import api from './api';
import type { Review } from '../types/product.types';

export const reviewService = {
  getByProduct: async (productId: string): Promise<Review[]> => {
    const res = await api.get<{ success: boolean; data: Review[] }>(`/reviews?productId=${productId}`);
    return res.data.data;
  },

  create: async (data: { productId: string; rating: number; title: string; body: string }): Promise<Review> => {
    const res = await api.post<{ success: boolean; data: Review }>('/reviews', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<{ rating: number; title: string; body: string }>): Promise<Review> => {
    const res = await api.patch<{ success: boolean; data: Review }>(`/reviews/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/reviews/${id}`);
  },
};
