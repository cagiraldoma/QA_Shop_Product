import api from './api';
import type { Order } from '../types/order.types';
import type { PaginatedResponse } from '../types/api.types';

export const orderService = {
  checkout: async (data: { addressId: string; couponCode?: string; notes?: string }): Promise<Order> => {
    const res = await api.post<{ success: boolean; data: Order }>('/orders', data);
    return res.data.data;
  },

  getAll: async (page = 1, limit = 10): Promise<PaginatedResponse<Order>> => {
    const res = await api.get<{ success: boolean; data: PaginatedResponse<Order> }>(
      `/orders?page=${page}&limit=${limit}`,
    );
    return res.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get<{ success: boolean; data: Order }>(`/orders/${id}`);
    return res.data.data;
  },

  cancel: async (id: string): Promise<Order> => {
    const res = await api.post<{ success: boolean; data: Order }>(`/orders/${id}/cancel`);
    return res.data.data;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const res = await api.patch<{ success: boolean; data: Order }>(`/orders/${id}/status`, { status });
    return res.data.data;
  },
};
