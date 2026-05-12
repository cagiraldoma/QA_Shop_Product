import api from './api';
import type { PaginatedResponse } from '../types/api.types';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minimumAmount: number | null;
  maximumDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type CreateCouponDto = Omit<Coupon, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>;

export const couponService = {
  getAll: async (page = 1): Promise<PaginatedResponse<Coupon>> => {
    const res = await api.get<{ success: boolean; data: PaginatedResponse<Coupon> }>(
      `/coupons?page=${page}&limit=20`,
    );
    return res.data.data;
  },

  create: async (data: CreateCouponDto): Promise<Coupon> => {
    const res = await api.post<{ success: boolean; data: Coupon }>('/coupons', data);
    return res.data.data;
  },

  update: async (id: string, data: Partial<Coupon>): Promise<Coupon> => {
    const res = await api.patch<{ success: boolean; data: Coupon }>(`/coupons/${id}`, data);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/coupons/${id}`);
  },
};
