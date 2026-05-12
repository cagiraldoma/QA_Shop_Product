import type { Product } from './product.types';

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CouponValidation {
  valid: boolean;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  discountAmount: number;
}
