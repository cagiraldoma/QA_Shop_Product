import api from './api';
import type { Cart, CouponValidation } from '../types/cart.types';

export const cartService = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get<{ success: boolean; data: Cart }>('/cart');
    return res.data.data;
  },

  addItem: async (productId: string, quantity: number): Promise<Cart> => {
    const res = await api.post<{ success: boolean; data: Cart }>('/cart/items', { productId, quantity });
    return res.data.data;
  },

  updateItem: async (itemId: string, quantity: number): Promise<Cart> => {
    const res = await api.patch<{ success: boolean; data: Cart }>(`/cart/items/${itemId}`, { quantity });
    return res.data.data;
  },

  removeItem: async (itemId: string): Promise<Cart> => {
    const res = await api.delete<{ success: boolean; data: Cart }>(`/cart/items/${itemId}`);
    return res.data.data;
  },

  clearCart: async (): Promise<Cart> => {
    const res = await api.delete<{ success: boolean; data: Cart }>('/cart');
    return res.data.data;
  },

  validateCoupon: async (code: string, subtotal: number): Promise<CouponValidation> => {
    const res = await api.post<{ success: boolean; data: CouponValidation }>('/cart/validate-coupon', { code, subtotal });
    return res.data.data;
  },
};
