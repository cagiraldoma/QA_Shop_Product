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
