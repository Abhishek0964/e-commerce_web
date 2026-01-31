-- =========================================
-- SEED DATA: CATEGORIES, PRODUCTS, INVENTORY
-- =========================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =====================
-- 1️⃣ CATEGORIES
-- =====================

insert into public.categories
(id, name, slug, description, image_url, display_order, is_active)
values
('11111111-1111-1111-1111-111111111111', 'Electronics', 'electronics',
 'Latest gadgets, smartphones, laptops, and electronic accessories',
 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop',
 1, true),

('22222222-2222-2222-2222-222222222222', 'Fashion', 'fashion',
 'Trendy clothing, footwear, and accessories',
 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop',
 2, true),

('33333333-3333-3333-3333-333333333333', 'Home & Kitchen', 'home-kitchen',
 'Home appliances, kitchen tools, and decor essentials',
 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?q=80&w=1200&auto=format&fit=crop',
 3, true),

('44444444-4444-4444-4444-444444444444', 'Books', 'books',
 'Bestsellers, classics, and educational books',
 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1200&auto=format&fit=crop',
 4, true),

('55555555-5555-5555-5555-555555555555', 'Sports', 'sports',
 'Sports equipment, fitness gear, and outdoor essentials',
 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
 5, true)
on conflict (id) do nothing;

-- =====================
-- 2️⃣ PRODUCTS
-- =====================

insert into public.products
(id, name, slug, description, price, compare_at_price,
 category_id, images, is_featured, is_active)
values

-- Electronics
(gen_random_uuid(), 'Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones',
 'Premium over-ear wireless headphones with noise cancellation and 30-hour battery life.',
 2499, 3499, '11111111-1111-1111-1111-111111111111',
 '[{"url":"https://images.unsplash.com/photo-1505740420928-5e560c06d30e","alt":"Headphones"}]'::jsonb,
 true, true),

(gen_random_uuid(), 'Smartphone 5G 128GB', 'smartphone-5g-128gb',
 'Powerful 5G smartphone with AMOLED display and triple camera.',
 18999, 24999, '11111111-1111-1111-1111-111111111111',
 '[{"url":"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9","alt":"Smartphone"}]'::jsonb,
 true, true),

(gen_random_uuid(), 'Ultra Slim Laptop 14"', 'laptop-14-inch-ultra-slim',
 'Lightweight laptop with Intel i5, 8GB RAM, and 512GB SSD.',
 42999, 54999, '11111111-1111-1111-1111-111111111111',
 '[{"url":"https://images.unsplash.com/photo-1496181133206-80ce9b88a853","alt":"Laptop"}]'::jsonb,
 false, true),

-- Fashion
(gen_random_uuid(), 'Men’s Cotton T-Shirt', 'mens-cotton-tshirt',
 'Soft, breathable cotton t-shirt for everyday comfort.',
 599, 999, '22222222-2222-2222-2222-222222222222',
 '[{"url":"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab","alt":"T-shirt"}]'::jsonb,
 false, true),

(gen_random_uuid(), 'Women’s Running Shoes', 'womens-running-shoes',
 'Lightweight running shoes with cushioned sole and breathable mesh.',
 2199, 3499, '22222222-2222-2222-2222-222222222222',
 '[{"url":"https://images.unsplash.com/photo-1542291026-7eec264c27ff","alt":"Running shoes"}]'::jsonb,
 true, true),

-- Home & Kitchen
(gen_random_uuid(), 'Stainless Steel Cookware Set', 'stainless-steel-cookware-set',
 '5-piece stainless steel cookware set with even heat distribution.',
 4999, 7999, '33333333-3333-3333-3333-333333333333',
 '[{"url":"https://images.unsplash.com/photo-1585659722983-3a675dabf23d","alt":"Cookware"}]'::jsonb,
 false, true),

(gen_random_uuid(), 'High-Speed Electric Blender', 'high-speed-electric-blender',
 '1000W blender with multiple speed settings and large jar.',
 2799, 3999, '33333333-3333-3333-3333-333333333333',
 '[{"url":"https://images.unsplash.com/photo-1570222094114-d054a817e56b","alt":"Blender"}]'::jsonb,
 false, true),

-- Books
(gen_random_uuid(), 'Classic Fiction Collection', 'classic-fiction-collection',
 'Set of 5 timeless fiction novels.',
 1299, 1999, '44444444-4444-4444-4444-444444444444',
 '[{"url":"https://images.unsplash.com/photo-1512820790803-83ca734da794","alt":"Books"}]'::jsonb,
 false, true),

(gen_random_uuid(), 'Healthy Indian Cooking', 'healthy-indian-cooking',
 'Indian cookbook with 100+ nutritious recipes.',
 699, 999, '44444444-4444-4444-4444-444444444444',
 '[{"url":"https://images.unsplash.com/photo-1588599217399-fcdc6733d35e","alt":"Cookbook"}]'::jsonb,
 false, true),

-- Sports
(gen_random_uuid(), 'Premium Yoga Mat', 'premium-yoga-mat',
 'Non-slip yoga mat with extra cushioning.',
 1299, 1999, '55555555-5555-5555-5555-555555555555',
 '[{"url":"https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f","alt":"Yoga mat"}]'::jsonb,
 false, true),

(gen_random_uuid(), 'Adjustable Dumbbell Set 20kg', 'adjustable-dumbbell-set-20kg',
 'Adjustable dumbbell set for home workouts.',
 3499, 4999, '55555555-5555-5555-5555-555555555555',
 '[{"url":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b","alt":"Dumbbells"}]'::jsonb,
 true, true);

-- =====================
-- 3️⃣ INVENTORY
-- =====================

insert into public.inventory
(product_id, quantity, reserved, low_stock_threshold)
select
  id,
  floor(random() * 60 + 20)::int, -- random stock 20–80
  0,
  10
from public.products
on conflict (product_id) do nothing;
