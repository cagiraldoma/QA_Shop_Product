import api from './api';
import type { UserProfile } from '../types/auth.types';
import type { Address } from '../types/order.types';
import type { PaginatedResponse } from '../types/api.types';

export const userService = {
  getAll: async (page = 1): Promise<PaginatedResponse<UserProfile>> => {
    const res = await api.get<{ success: boolean; data: PaginatedResponse<UserProfile> }>(
      `/users?page=${page}`,
    );
    return res.data.data;
  },

  update: async (id: string, data: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await api.patch<{ success: boolean; data: UserProfile }>(`/users/${id}`, data);
    return res.data.data;
  },

  changePassword: async (id: string, data: { currentPassword: string; newPassword: string }) => {
    const res = await api.patch<{ success: boolean; data: { message: string } }>(
      `/users/${id}/password`,
      data,
    );
    return res.data.data;
  },

  // Addresses
  getAddresses: async (): Promise<Address[]> => {
    const res = await api.get<{ success: boolean; data: Address[] }>('/addresses');
    return res.data.data;
  },

  createAddress: async (data: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> => {
    const res = await api.post<{ success: boolean; data: Address }>('/addresses', data);
    return res.data.data;
  },

  updateAddress: async (id: string, data: Partial<Address>): Promise<Address> => {
    const res = await api.patch<{ success: boolean; data: Address }>(`/addresses/${id}`, data);
    return res.data.data;
  },

  deleteAddress: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefaultAddress: async (id: string): Promise<Address> => {
    const res = await api.patch<{ success: boolean; data: Address }>(`/addresses/${id}/default`);
    return res.data.data;
  },
};
