import { create } from 'zustand';
import type { Cart, CartItem, CouponValidation } from '../types/cart.types';

interface CartStore {
  items: CartItem[];
  coupon: CouponValidation | null;
  isOpen: boolean;

  syncFromServer: (cart: Cart) => void;
  removeCoupon: () => void;
  applyCoupon: (coupon: CouponValidation) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  totalItems: () => number;
  subtotal: () => number;
  discountAmount: () => number;
  shippingCost: () => number;
  tax: () => number;
  total: () => number;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  coupon: null,
  isOpen: false,

  syncFromServer: (cart) => set({ items: cart.items }),

  removeCoupon: () => set({ coupon: null }),

  applyCoupon: (coupon) => set({ coupon }),

  clearCart: () => set({ items: [], coupon: null }),

  toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + Number(i.product.price) * i.quantity, 0),

  discountAmount: () => {
    const coupon = get().coupon;
    if (!coupon) return 0;
    return coupon.discountAmount;
  },

  shippingCost: () => {
    const sub = get().subtotal() - get().discountAmount();
    return sub >= 100 ? 0 : 9.99;
  },

  tax: () => {
    const taxable = get().subtotal() - get().discountAmount();
    return +(taxable * 0.08).toFixed(2);
  },

  total: () => {
    const sub = get().subtotal();
    const discount = get().discountAmount();
    const shipping = get().shippingCost();
    const tax = get().tax();
    return +(sub - discount + shipping + tax).toFixed(2);
  },
}));
