import { supabase } from './supabase';
import type {
  Product, Category, Brand, Review, CartItem, WishlistItem, Address, Order, OrderItem,
} from '../types';

const PRODUCT_SELECT = `
  id, slug, title, description, category_id, brand_id, price, compare_at_price,
  currency, sku, rating, rating_count, inventory_count, is_featured, is_active,
  tags, created_at,
  category:categories(id, name, slug),
  brand:brands(id, name, slug),
  product_images(id, product_id, url, alt_text, position),
  product_variants(id, product_id, name, value, sku, price_override, inventory_count)
`;

export type ProductQuery = {
  categorySlug?: string;
  brandSlug?: string;
  search?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  onSaleOnly?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
};

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, description, parent_id, image_url, created_at')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchBrands(): Promise<Brand[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, name, slug, logo_url, country, created_at')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

export async function fetchProducts(query: ProductQuery = {}): Promise<{ items: Product[]; total: number }> {
  let q = supabase.from('products').select(PRODUCT_SELECT, { count: 'exact' }).eq('is_active', true);

  // Resolve category/brand slugs to IDs first — nested .eq('category.slug', ...) is not reliable.
  if (query.categorySlug) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', query.categorySlug)
      .maybeSingle();
    if (!cat) return { items: [], total: 0 };
    q = q.eq('category_id', cat.id);
  }
  if (query.brandSlug) {
    const { data: brand } = await supabase
      .from('brands')
      .select('id')
      .eq('slug', query.brandSlug)
      .maybeSingle();
    if (!brand) return { items: [], total: 0 };
    q = q.eq('brand_id', brand.id);
  }
  if (query.search) {
    q = q.or(`title.ilike.%${query.search}%,description.ilike.%${query.search}%`);
  }
  if (query.tags && query.tags.length > 0) {
    q = q.overlaps('tags', query.tags);
  }
  if (typeof query.minPrice === 'number') {
    q = q.gte('price', query.minPrice);
  }
  if (typeof query.maxPrice === 'number') {
    q = q.lte('price', query.maxPrice);
  }
  if (typeof query.minRating === 'number') {
    q = q.gte('rating', query.minRating);
  }
  if (query.inStockOnly) {
    q = q.gt('inventory_count', 0);
  }
  if (query.onSaleOnly) {
    q = q.not('compare_at_price', 'is', null);
  }

  switch (query.sort) {
    case 'price_asc':
      q = q.order('price', { ascending: true });
      break;
    case 'price_desc':
      q = q.order('price', { ascending: false });
      break;
    case 'rating':
      q = q.order('rating', { ascending: false }).order('rating_count', { ascending: false });
      break;
    case 'newest':
      q = q.order('created_at', { ascending: false });
      break;
    default:
      q = q.order('is_featured', { ascending: false }).order('rating_count', { ascending: false });
  }

  const limit = query.limit ?? 12;
  const offset = query.offset ?? 0;
  q = q.range(offset, offset + limit - 1);

  const { data, error, count } = await q;
  if (error) throw error;
  return { items: (data ?? []) as unknown as Product[], total: count ?? 0 };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Product) ?? null;
}

export async function fetchRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const { items } = await fetchProducts({
    categorySlug: product.category?.slug,
    limit: limit + 1,
    sort: 'relevance',
  });
  return items.filter((p) => p.id !== product.id).slice(0, limit);
}

export async function fetchFeaturedProducts(limit = 8): Promise<Product[]> {
  const { items } = await fetchProducts({ limit, sort: 'relevance' });
  return items.filter((p) => p.is_featured).slice(0, limit);
}

export async function fetchReviews(productId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, product_id, user_id, author_name, rating, title, body, is_approved, created_at')
    .eq('product_id', productId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function submitReview(
  productId: string,
  authorName: string,
  rating: number,
  title: string,
  body: string,
): Promise<Review> {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      author_name: authorName,
      rating,
      title,
      body,
      is_approved: true,
    })
    .select('id, product_id, user_id, author_name, rating, title, body, is_approved, created_at')
    .single();
  if (error) throw error;
  return data as Review;
}

export async function searchSuggestions(term: string, limit = 6): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_SELECT)
    .ilike('title', `%${term}%`)
    .eq('is_active', true)
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as unknown as Product[];
}

export async function fetchCartItems(): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `id, user_id, product_id, variant_id, quantity, created_at,
       product:${PRODUCT_SELECT},
       variant:product_variants(id, product_id, name, value, sku, price_override, inventory_count)`,
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as CartItem[];
}

export async function addToCart(productId: string, variantId: string | null, quantity: number): Promise<void> {
  const { error } = await supabase
    .from('cart_items')
    .upsert(
      { product_id: productId, variant_id: variantId, quantity },
      { onConflict: 'user_id,product_id,variant_id' },
    );
  if (error) throw error;
}

export async function updateCartQuantity(itemId: string, quantity: number): Promise<void> {
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
  if (error) throw error;
}

export async function removeFromCart(itemId: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
  if (error) throw error;
}

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist')
    .select(`id, user_id, product_id, created_at, product:${PRODUCT_SELECT}`)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as WishlistItem[];
}

export async function toggleWishlist(productId: string, currentlyIn: boolean): Promise<boolean> {
  if (currentlyIn) {
    const { error } = await supabase.from('wishlist').delete().eq('product_id', productId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from('wishlist').insert({ product_id: productId });
  if (error) throw error;
  return true;
}

export async function isWishlisted(productId: string): Promise<boolean> {
  const { count, error } = await supabase
    .from('wishlist')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId);
  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function fetchAddresses(): Promise<Address[]> {
  const { data, error } = await supabase
    .from('addresses')
    .select('id, user_id, label, full_name, line1, line2, city, state, postal_code, country, phone, is_default, created_at')
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function saveAddress(addr: Partial<Address> & { id?: string }): Promise<Address> {
  if (addr.id) {
    const { data, error } = await supabase
      .from('addresses')
      .update({
        label: addr.label, full_name: addr.full_name, line1: addr.line1, line2: addr.line2,
        city: addr.city, state: addr.state, postal_code: addr.postal_code,
        country: addr.country, phone: addr.phone, is_default: addr.is_default,
      })
      .eq('id', addr.id)
      .select('id, user_id, label, full_name, line1, line2, city, state, postal_code, country, phone, is_default, created_at')
      .single();
    if (error) throw error;
    return data as Address;
  }
  const { data, error } = await supabase
    .from('addresses')
    .insert({
      label: addr.label, full_name: addr.full_name, line1: addr.line1, line2: addr.line2,
      city: addr.city, state: addr.state, postal_code: addr.postal_code,
      country: addr.country, phone: addr.phone, is_default: addr.is_default,
    })
    .select('id, user_id, label, full_name, line1, line2, city, state, postal_code, country, phone, is_default, created_at')
    .single();
  if (error) throw error;
  return data as Address;
}

export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select(
      `id, user_id, order_number, status, subtotal, shipping, tax, total, currency,
       shipping_address, email, created_at, updated_at,
       order_items(id, order_id, product_id, variant_id, title, image_url, variant_name, quantity, unit_price)`,
    )
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Order[];
}

export async function placeOrder(order: {
  order_number: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  email: string;
  shipping_address: Record<string, unknown>;
  items: Array<{
    product_id: string | null;
    variant_id: string | null;
    title: string;
    image_url: string | null;
    variant_name: string | null;
    quantity: number;
    unit_price: number;
  }>;
}): Promise<Order> {
  const { data: orderRow, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: order.order_number,
      subtotal: order.subtotal,
      shipping: order.shipping,
      tax: order.tax,
      total: order.total,
      currency: order.currency,
      email: order.email,
      shipping_address: order.shipping_address,
      status: 'confirmed',
    })
    .select('id, user_id, order_number, status, subtotal, shipping, tax, total, currency, shipping_address, email, created_at, updated_at')
    .single();
  if (orderError) throw orderError;
  const orderRec = orderRow as Order;

  const rows = order.items.map((it) => ({ ...it, order_id: orderRec.id }));
  const { error: itemsError } = await supabase.from('order_items').insert(rows);
  if (itemsError) throw itemsError;

  const { error: clearError } = await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (clearError) throw clearError;

  return orderRec;
}

export type { OrderItem };
