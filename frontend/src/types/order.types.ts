import type { Product } from './product.types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Address {
  id: string;
  userId: string;
  type: 'SHIPPING' | 'BILLING';
  firstName: string;
  lastName: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  priceAtTime: string;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  status: OrderStatus;
  subtotal: string;
  discountAmount: string;
  shippingCost: string;
  tax: string;
  total: string;
  couponCode: string | null;
  notes: string | null;
  items: OrderItem[];
  address: Address;
  createdAt: string;
  updatedAt: string;
}
