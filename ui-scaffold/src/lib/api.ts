// Stubbed API layer - all methods return mock data
// This is designed to be fully replaceable with real API calls without changing component code

import {
  Product,
  Category,
  Cart,
  User,
  Order,
  SearchResult,
  SearchParams,
  Promotion,
  HeroSection,
  AdminDashboardStats,
  AdminProductManagement,
  UserSession,
} from './types';

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality sound with active noise cancellation',
    price: 199.99,
    originalPrice: 249.99,
    category: 'electronics',
    image: '/images/product-1.jpg',
    imageAlt: 'Premium wireless headphones',
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    tags: ['audio', 'wireless', 'premium'],
  },
  {
    id: '2',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging for compatible devices',
    price: 49.99,
    category: 'electronics',
    image: '/images/product-2.jpg',
    imageAlt: 'Wireless charging pad',
    rating: 4.2,
    reviewCount: 87,
    inStock: true,
    tags: ['charging', 'wireless', 'convenient'],
  },
  {
    id: '3',
    name: 'USB-C Cable Bundle',
    description: 'Pack of 3 durable USB-C cables',
    price: 24.99,
    originalPrice: 34.99,
    category: 'accessories',
    image: '/images/product-3.jpg',
    imageAlt: 'USB-C cable bundle',
    rating: 4.7,
    reviewCount: 245,
    inStock: true,
    tags: ['cables', 'usb-c', 'bundle'],
  },
  {
    id: '4',
    name: 'Portable Power Bank',
    description: '20000mAh portable battery with multiple ports',
    price: 79.99,
    category: 'electronics',
    image: '/images/product-4.jpg',
    imageAlt: 'Portable power bank',
    rating: 4.6,
    reviewCount: 312,
    inStock: true,
    tags: ['power', 'portable', 'battery'],
  },
  {
    id: '5',
    name: 'Phone Stand Mount',
    description: 'Adjustable phone stand for desk and travel',
    price: 29.99,
    category: 'accessories',
    image: '/images/product-5.jpg',
    imageAlt: 'Phone stand mount',
    rating: 4.3,
    reviewCount: 156,
    inStock: true,
    tags: ['stand', 'phone', 'portable'],
  },
  {
    id: '6',
    name: 'Blue Light Filter Screen',
    description: 'Protective screen with blue light filtering',
    price: 39.99,
    category: 'accessories',
    image: '/images/product-6.jpg',
    imageAlt: 'Blue light filter screen',
    rating: 4.1,
    reviewCount: 94,
    inStock: true,
    tags: ['protection', 'screen', 'eyecare'],
  },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', description: 'Electronic devices and gadgets' },
  { id: '2', name: 'Accessories', slug: 'accessories', description: 'Phone and device accessories' },
  { id: '3', name: 'Audio', slug: 'audio', description: 'Audio devices and equipment' },
  { id: '4', name: 'Charging', slug: 'charging', description: 'Chargers and power solutions' },
];

const mockPromotions: Promotion[] = [
  {
    id: '1',
    title: 'Spring Sale',
    description: 'Up to 50% off on selected items',
    image: '/images/promo-1.jpg',
    imageAlt: 'Spring sale promotion',
    badge: 'SALE',
    discountPercent: 50,
    link: '/search?category=electronics',
  },
  {
    id: '2',
    title: 'New Arrivals',
    description: 'Discover the latest tech products',
    image: '/images/promo-2.jpg',
    imageAlt: 'New arrivals',
    badge: 'NEW',
    link: '/search?sortBy=newest',
  },
  {
    id: '3',
    title: 'Free Shipping',
    description: 'On orders over $100',
    image: '/images/promo-3.jpg',
    imageAlt: 'Free shipping promotion',
    badge: 'FREE SHIP',
    link: '/products',
  },
];

const mockHeroSection: HeroSection = {
  title: 'Welcome to ShopHub',
  subtitle: 'Discover premium electronics and accessories at unbeatable prices',
  ctaText: 'Shop Now',
  ctaLink: '/products',
  backgroundImage: '/images/hero-bg.jpg',
  backgroundImageAlt: 'Hero section background',
};

// Products API
export async function getProducts(params?: SearchParams): Promise<SearchResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  let filtered = [...mockProducts];

  if (params?.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.tags?.some((t) => t.toLowerCase().includes(query))
    );
  }

  if (params?.category) {
    filtered = filtered.filter((p) => p.category === params.category);
  }

  if (params?.minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= params.minPrice!);
  }

  if (params?.maxPrice !== undefined) {
    filtered = filtered.filter((p) => p.price <= params.maxPrice!);
  }

  // Sorting
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // In real implementation, would sort by createdAt
        filtered.reverse();
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }
  }

  const page = params?.page || 1;
  const limit = params?.limit || 12;
  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    products: filtered.slice(start, end),
    total: filtered.length,
    page,
    limit,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return mockProducts.find((p) => p.id === id) || null;
}

// Categories API
export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...mockCategories];
}

// Promotions API
export async function getPromotions(): Promise<Promotion[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [...mockPromotions];
}

// Hero Section API
export async function getHeroSection(): Promise<HeroSection> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { ...mockHeroSection };
}

// Cart API
export async function getCart(cartId: string): Promise<Cart | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Return mock cart
  return {
    id: cartId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function addToCart(cartId: string, productId: string, quantity: number): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: cartId,
    items: [{ productId, quantity, addedAt: new Date() }],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export async function removeFromCart(cartId: string, productId: string): Promise<Cart> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id: cartId,
    items: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// User API
export async function getCurrentUser(): Promise<UserSession | null> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  // Return null to indicate not logged in
  return null;
}

export async function signUp(email: string, password: string, name: string): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    userId: Math.random().toString(36).substr(2, 9),
    email,
    name,
  };
}

export async function signIn(email: string, password: string): Promise<UserSession> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    userId: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split('@')[0],
  };
}

export async function signOut(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}

// Orders API
export async function getUserOrders(userId: string): Promise<Order[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return [];
}

export async function createOrder(userId: string, items: any[], total: number): Promise<Order> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    id: Math.random().toString(36).substr(2, 9),
    userId,
    items,
    total,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

// Admin API
export async function getAdminStats(): Promise<AdminDashboardStats> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    totalRevenue: 125430.5,
    totalOrders: 1324,
    totalCustomers: 892,
    totalProducts: mockProducts.length,
    revenueChangePercent: 12.5,
    ordersChangePercent: 8.3,
    customersChangePercent: 15.2,
  };
}

export async function getAdminProducts(): Promise<AdminProductManagement[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockProducts.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    stock: Math.floor(Math.random() * 100) + 10,
    status: 'active' as const,
    createdAt: new Date(),
    salesCount: p.reviewCount,
  }));
}

export async function updateProduct(id: string, data: Partial<AdminProductManagement>): Promise<AdminProductManagement> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return {
    id,
    name: data.name || 'Product',
    price: data.price || 0,
    stock: data.stock || 0,
    status: data.status || 'active',
    createdAt: new Date(),
    salesCount: 0,
  };
}

export async function deleteProduct(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 200));
}
