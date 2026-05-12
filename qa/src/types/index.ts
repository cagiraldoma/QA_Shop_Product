// Domain types (copied/adapted from frontend)

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentId: string | null;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  comparePrice: string | null;
  stock: number;
  sku: string;
  imageUrls: string[];
  isActive: boolean;
  isFeatured: boolean;
  avgRating: number;
  reviewCount: number;
  categoryId: string;
  category?: { id: string; name: string; slug: string };
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  isVisible: boolean;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string; avatarUrl: string | null };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  sortBy?: string;
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Basic User inferred from frontend usage (no dedicated user.types.ts)
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
}

// Basic CartItem for test helpers
export interface CartItem {
  productId: string;
  quantity: number;
}

// Test helper types
export type TestTag = '@smoke' | '@regression' | '@critical' | '@api' | '@visual' | '@e2e';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export type UserRole = 'customer' | 'admin';
