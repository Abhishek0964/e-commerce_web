// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  imageAlt: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserSession {
  userId: string;
  email: string;
  name: string;
}

// Order types
export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  shippingAddress?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Search and filtering
export interface SearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

// Featured/promo types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  link?: string;
  badge?: string;
  discountPercent?: number;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  backgroundImageAlt: string;
}

// Admin types
export interface AdminDashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChangePercent: number;
  ordersChangePercent: number;
  customersChangePercent: number;
}

export interface AdminProductManagement {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: Date;
  salesCount: number;
}
