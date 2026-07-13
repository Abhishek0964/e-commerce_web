/*
# Catalog schema: categories, brands, products, variants, product images, reviews

## Purpose
Establishes the product catalog foundation for the storefront.

## New tables
1. `categories` — hierarchical product categories (self-referencing parent).
   - id (uuid pk), name, slug (unique), description, parent_id (self fk), image_url, created_at.
2. `brands` — product brands.
   - id (uuid pk), name, slug (unique), logo_url, country, created_at.
3. `products` — sellable items.
   - id, slug (unique), title, description, category_id (fk), brand_id (fk),
     price (numeric), compare_at_price (numeric, nullable) for discounts,
     currency, sku, rating (numeric), rating_count, inventory_count,
     is_featured, is_active, tags (text[]), created_at.
4. `product_images` — multiple images per product, ordered.
   - id, product_id (fk), url, alt_text, position.
5. `product_variants` — size/color etc.
   - id, product_id (fk), name, value, sku, price_override, inventory_count.
6. `reviews` — customer reviews with rating, title, body, author name.
   - id, product_id (fk), user_id (fk auth.users default auth.uid), author_name,
     rating (1-5), title, body, is_approved, created_at.

## Security
- categories, brands, products, product_images, product_variants: public read
  (TO anon, authenticated) — catalog is browsable without sign-in.
- reviews: public read of approved reviews; authenticated insert scoped to owner.
- No writes to catalog tables from the frontend (admin-managed); we still add
  anon INSERT policies for reviews so a signed-in user can submit one.

## Indexes
- products.slug (unique), products.category_id, products.brand_id,
  products.is_featured, products.is_active, product_images.product_id,
  product_variants.product_id, reviews.product_id.

## Notes
- Numeric prices are stored as numeric(12,2) to avoid float drift.
- compare_at_price lets the UI show a discount badge + strike-through.
- tags supports array contains queries for filtering.
- reviews.rating is constrained to 1..5.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  parent_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  brand_id uuid REFERENCES brands(id) ON DELETE SET NULL,
  price numeric(12,2) NOT NULL DEFAULT 0,
  compare_at_price numeric(12,2),
  currency text NOT NULL DEFAULT 'USD',
  sku text,
  rating numeric(2,1) NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  inventory_count integer NOT NULL DEFAULT 0,
  is_featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  tags text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  alt_text text,
  position integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  value text NOT NULL,
  sku text,
  price_override numeric(12,2),
  inventory_count integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  body text,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Catalog: public read
DROP POLICY IF EXISTS "catalog_read_categories" ON categories;
CREATE POLICY "catalog_read_categories" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalog_read_brands" ON brands;
CREATE POLICY "catalog_read_brands" ON brands FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalog_read_products" ON products;
CREATE POLICY "catalog_read_products" ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalog_read_images" ON product_images;
CREATE POLICY "catalog_read_images" ON product_images FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalog_read_variants" ON product_variants;
CREATE POLICY "catalog_read_variants" ON product_variants FOR SELECT TO anon, authenticated USING (true);

-- Reviews: public read of approved reviews; authenticated users can insert their own
DROP POLICY IF EXISTS "reviews_read_approved" ON reviews;
CREATE POLICY "reviews_read_approved" ON reviews FOR SELECT TO anon, authenticated USING (is_approved = true);

DROP POLICY IF EXISTS "reviews_insert_own" ON reviews;
CREATE POLICY "reviews_insert_own" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_update_own" ON reviews;
CREATE POLICY "reviews_update_own" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "reviews_delete_own" ON reviews;
CREATE POLICY "reviews_delete_own" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
