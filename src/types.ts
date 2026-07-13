export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  created_at: string;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  country: string | null;
  created_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  position: number;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  name: string;
  value: string;
  sku: string | null;
  price_override: number | null;
  inventory_count: number;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category_id: string | null;
  brand_id: string | null;
  price: number;
  compare_at_price: number | null;
  currency: string;
  sku: string | null;
  rating: number;
  rating_count: number;
  inventory_count: number;
  is_featured: boolean;
  is_active: boolean;
  tags: string[];
  created_at: string;
  category?: Category | null;
  brand?: Brand | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string | null;
  author_name: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  created_at: string;
};

export type CartItem = {
  id: string;
  user_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  created_at: string;
  product?: Product;
  variant?: ProductVariant | null;
};

export type WishlistItem = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
};

export type Address = {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  shipping_address: Record<string, unknown> | null;
  email: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  title: string;
  image_url: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
};

export type SortOption = 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest';
