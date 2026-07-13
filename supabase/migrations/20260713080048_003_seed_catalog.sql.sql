/*
# Seed catalog data (with reviews fix)

## Purpose
1. Make reviews.user_id nullable so editorial/seed reviews can exist without a
   real auth.users row. User-submitted reviews still default to auth.uid() and
   remain owner-scoped via RLS. NULL-user_id reviews are read-only editorial
   content (no owner can update/delete them).
2. Populate categories, brands, products, product_images, product_variants, and
   a few approved reviews so the storefront renders with realistic content.

## Notes
- Uses ON CONFLICT DO NOTHING keyed on unique slugs so re-running is safe.
- Prices are in USD. compare_at_price set on some products to show discounts.
- Images reference Pexels stock photo URLs (hot-linked, not downloaded).
- Seed reviews use NULL user_id (editorial); real user reviews use auth.uid().
*/

-- Make user_id nullable to allow editorial seed reviews without a real auth user
ALTER TABLE reviews ALTER COLUMN user_id DROP NOT NULL;

-- Categories
INSERT INTO categories (name, slug, description, image_url) VALUES
  ('Apparel', 'apparel', 'Clothing for every season — tops, bottoms, outerwear.', 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Footwear', 'footwear', 'Sneakers, runners, boots, and sandals.', 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Electronics', 'electronics', 'Headphones, wearables, and audio gear.', 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Accessories', 'accessories', 'Bags, watches, sunglasses, and more.', 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=800'),
  ('Home', 'home', 'Objects and lighting for considered living spaces.', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800')
ON CONFLICT (slug) DO NOTHING;

-- Subcategories
INSERT INTO categories (name, slug, description, parent_id, image_url)
SELECT 'Tops', 'tops', 'T-shirts, shirts, and knits.', id, 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE slug = 'apparel'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, image_url)
SELECT 'Bottoms', 'bottoms', 'Trousers, jeans, and shorts.', id, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE slug = 'apparel'
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (name, slug, description, parent_id, image_url)
SELECT 'Sneakers', 'sneakers', 'Everyday and performance sneakers.', id, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=800'
FROM categories WHERE slug = 'footwear'
ON CONFLICT (slug) DO NOTHING;

-- Brands
INSERT INTO brands (name, slug, country) VALUES
  ('Aurora', 'aurora', 'United States'),
  ('Nimbus', 'nimbus', 'Denmark'),
  ('Vertex', 'vertex', 'Germany'),
  ('Lumen', 'lumen', 'Japan'),
  ('Atlas', 'atlas', 'United States'),
  ('Cove', 'cove', 'Italy')
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE
  cat_apparel uuid; cat_tops uuid; cat_bottoms uuid;
  cat_sneakers uuid; cat_footwear uuid;
  cat_electronics uuid; cat_accessories uuid; cat_home uuid;
  b_aurora uuid; b_nimbus uuid; b_vertex uuid; b_lumen uuid; b_atlas uuid; b_cove uuid;
  p uuid;
BEGIN
  SELECT id INTO cat_apparel FROM categories WHERE slug='apparel';
  SELECT id INTO cat_tops FROM categories WHERE slug='tops';
  SELECT id INTO cat_bottoms FROM categories WHERE slug='bottoms';
  SELECT id INTO cat_sneakers FROM categories WHERE slug='sneakers';
  SELECT id INTO cat_footwear FROM categories WHERE slug='footwear';
  SELECT id INTO cat_electronics FROM categories WHERE slug='electronics';
  SELECT id INTO cat_accessories FROM categories WHERE slug='accessories';
  SELECT id INTO cat_home FROM categories WHERE slug='home';
  SELECT id INTO b_aurora FROM brands WHERE slug='aurora';
  SELECT id INTO b_nimbus FROM brands WHERE slug='nimbus';
  SELECT id INTO b_vertex FROM brands WHERE slug='vertex';
  SELECT id INTO b_lumen FROM brands WHERE slug='lumen';
  SELECT id INTO b_atlas FROM brands WHERE slug='atlas';
  SELECT id INTO b_cove FROM brands WHERE slug='cove';

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('aurora-merino-crew', 'Aurora Merino Crew', 'A featherweight merino crew knit for year-round layering. Naturally temperature-regulating and odor-resistant.', cat_tops, b_aurora, 88.00, 120.00, 'AUR-MER-001', 4.8, 126, 64, true, true, ARRAY['new','bestseller','merino','knit'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Merino Crew front', 0),
    (p, 'https://images.pexels.com/photos/1666071/pexels-photo-1666071.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Merino Crew detail', 1),
    (p, 'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Merino Crew worn', 2);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'AUR-MER-001-S', 12), (p, 'Size', 'M', 'AUR-MER-001-M', 20),
    (p, 'Size', 'L', 'AUR-MER-001-L', 18), (p, 'Size', 'XL', 'AUR-MER-001-XL', 14);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('nimbus-cloud-runner', 'Nimbus Cloud Runner', 'Plush, energy-returning foam in a breathable knit upper. Built for daily miles and everything in between.', cat_sneakers, b_nimbus, 142.00, 180.00, 'NIM-CLR-002', 4.7, 342, 80, true, true, ARRAY['bestseller','running','lightweight'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Cloud Runner side', 0),
    (p, 'https://images.pexels.com/photos/1639729/pexels-photo-1639729.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Cloud Runner top', 1),
    (p, 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Cloud Runner on foot', 2);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', '8', 'NIM-CLR-002-8', 8), (p, 'Size', '9', 'NIM-CLR-002-9', 14),
    (p, 'Size', '10', 'NIM-CLR-002-10', 18), (p, 'Size', '11', 'NIM-CLR-002-11', 12);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('vertex-over-ear-headphones', 'Vertex Over-Ear Headphones', 'Studio-grade sound with adaptive noise cancellation and 40-hour battery life. Memory-foam cushions for all-day comfort.', cat_electronics, b_vertex, 249.00, 329.00, 'VTX-OEH-003', 4.9, 511, 45, true, true, ARRAY['bestseller','audio','wireless','anc'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Over-Ear Headphones', 0),
    (p, 'https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Over-Ear detail', 1),
    (p, 'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Over-Ear worn', 2);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Graphite', 'VTX-OEH-003-GR', 20), (p, 'Color', 'Silver', 'VTX-OEH-003-SV', 25);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('lumen-desk-lamp', 'Lumen Desk Lamp', 'Warm-to-cool tunable LED with a weighted brass base and touch dimming. Made to last decades.', cat_home, b_lumen, 119.00, NULL, 'LUM-DL-004', 4.6, 88, 30, false, true, ARRAY['new','lighting','brass'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1112597/pexels-photo-1112597.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Desk Lamp', 0),
    (p, 'https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Desk Lamp lit', 1);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('atlas-field-backpack', 'Atlas Field Backpack', 'Weatherproof 24L pack with a padded 16-inch laptop sleeve and magnetic quick-access pockets.', cat_accessories, b_atlas, 165.00, 210.00, 'ATL-FB-005', 4.7, 203, 52, true, true, ARRAY['bestseller','travel','waterproof'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=900', 'Atlas Field Backpack', 0),
    (p, 'https://images.pexels.com/photos/1062847/pexels-photo-1062847.jpeg?auto=compress&cs=tinysrgb&w=900', 'Atlas Field Backpack back', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Black', 'ATL-FB-005-BK', 24), (p, 'Color', 'Olive', 'ATL-FB-005-OL', 28);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('cove-leather-low', 'Cove Leather Low', 'Hand-finished Italian leather sneaker on a flexible cup sole. Minimal, versatile, made to age beautifully.', cat_sneakers, b_cove, 198.00, 240.00, 'COV-LL-006', 4.8, 97, 36, false, true, ARRAY['new','leather','minimal'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/267301/pexels-photo-267301.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Leather Low', 0),
    (p, 'https://images.pexels.com/photos/1456706/pexels-photo-1456706.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Leather Low pair', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', '8', 'COV-LL-006-8', 4), (p, 'Size', '9', 'COV-LL-006-9', 8),
    (p, 'Size', '10', 'COV-LL-006-10', 10), (p, 'Size', '11', 'COV-LL-006-11', 6);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('aurora-linen-shirt', 'Aurora Linen Shirt', 'Breathable European linen with a relaxed drape. Garment-dyed for a soft, lived-in feel from day one.', cat_tops, b_aurora, 95.00, NULL, 'AUR-LS-007', 4.5, 64, 40, false, true, ARRAY['new','linen','summer'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/293405/pexels-photo-293405.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Linen Shirt', 0),
    (p, 'https://images.pexels.com/photos/769749/pexels-photo-769749.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Linen Shirt detail', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'AUR-LS-007-S', 8), (p, 'Size', 'M', 'AUR-LS-007-M', 14),
    (p, 'Size', 'L', 'AUR-LS-007-L', 10), (p, 'Size', 'XL', 'AUR-LS-007-XL', 8);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('nimbus-trail-short', 'Nimbus Trail Short', '4-way stretch shell with a zip pocket and built-in liner. 7-inch inseam for versatile coverage.', cat_bottoms, b_nimbus, 68.00, 85.00, 'NIM-TS-008', 4.4, 51, 70, false, true, ARRAY['new','running','shorts'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Trail Short', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'NIM-TS-008-S', 16), (p, 'Size', 'M', 'NIM-TS-008-M', 24),
    (p, 'Size', 'L', 'NIM-TS-008-L', 20), (p, 'Size', 'XL', 'NIM-TS-008-XL', 10);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('vertex-true-wireless-earbuds', 'Vertex True Wireless Earbuds', 'Compact earbuds with spatial audio, IPX5 sweat resistance, and 28 hours total playback with the case.', cat_electronics, b_vertex, 159.00, 199.00, 'VTX-TWE-009', 4.6, 278, 60, true, true, ARRAY['bestseller','audio','wireless'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex True Wireless Earbuds', 0),
    (p, 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Earbuds case', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'White', 'VTX-TWE-009-WH', 30), (p, 'Color', 'Black', 'VTX-TWE-009-BK', 30);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('atlas-travel-wallet', 'Atlas Travel Wallet', 'Full-grain leather wallet with passport slot, RFID-blocking lining, and room for cards and boarding passes.', cat_accessories, b_atlas, 79.00, 99.00, 'ATL-TW-010', 4.7, 142, 48, false, true, ARRAY['leather','travel','rfid'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2079246/pexels-photo-2079246.jpeg?auto=compress&cs=tinysrgb&w=900', 'Atlas Travel Wallet', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Tan', 'ATL-TW-010-TN', 22), (p, 'Color', 'Black', 'ATL-TW-010-BK', 26);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('lumen-ceramic-vase', 'Lumen Ceramic Vase', 'Wheel-thrown stoneware vase with a matte glaze. Each piece carries subtle, unique variation.', cat_home, b_lumen, 58.00, NULL, 'LUM-CV-011', 4.8, 39, 25, false, true, ARRAY['new','ceramic','decor'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/4207791/pexels-photo-4207791.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Ceramic Vase', 0),
    (p, 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Ceramic Vase styled', 1);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('cove-wool-overcoat', 'Cove Wool Overcoat', 'Tailored 80% wool overcoat with a clean double-faced finish and horn buttons. A timeless winter staple.', cat_apparel, b_cove, 420.00, 520.00, 'COV-WO-012', 4.9, 74, 18, true, true, ARRAY['new','wool','outerwear','luxury'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2294353/pexels-photo-2294353.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Wool Overcoat', 0),
    (p, 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Wool Overcoat detail', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'COV-WO-012-S', 3), (p, 'Size', 'M', 'COV-WO-012-M', 6),
    (p, 'Size', 'L', 'COV-WO-012-L', 5), (p, 'Size', 'XL', 'COV-WO-012-XL', 4);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('aurora-tech-hoodie', 'Aurora Tech Hoodie', 'Water-repellent ripstop hoodie with bonded seams and a streamlined adjustable hood. Made to move.', cat_tops, b_aurora, 110.00, 140.00, 'AUR-TH-013', 4.6, 189, 55, false, true, ARRAY['bestseller','hoodie','techwear'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/8217425/pexels-photo-8217425.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Tech Hoodie', 0),
    (p, 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Tech Hoodie detail', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'AUR-TH-013-S', 10), (p, 'Size', 'M', 'AUR-TH-013-M', 18),
    (p, 'Size', 'L', 'AUR-TH-013-L', 15), (p, 'Size', 'XL', 'AUR-TH-013-XL', 12);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('nimbus-performance-tee', 'Nimbus Performance Tee', 'Moisture-wicking recycled poly tee with flatlock seams and a relaxed athletic cut.', cat_tops, b_nimbus, 45.00, 60.00, 'NIM-PT-014', 4.3, 96, 120, false, true, ARRAY['new','running','recycled'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Performance Tee', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', 'S', 'NIM-PT-014-S', 30), (p, 'Size', 'M', 'NIM-PT-014-M', 40),
    (p, 'Size', 'L', 'NIM-PT-014-L', 30), (p, 'Size', 'XL', 'NIM-PT-014-XL', 20);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('vertex-smart-watch', 'Vertex Smart Watch', 'AMOLED always-on display, multi-band GPS, 7-day battery, and health tracking with ECG and SpO2.', cat_electronics, b_vertex, 329.00, 399.00, 'VTX-SW-015', 4.7, 364, 38, true, true, ARRAY['bestseller','wearable','gps'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Smart Watch', 0),
    (p, 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Smart Watch wrist', 1);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Midnight', 'VTX-SW-015-MN', 18), (p, 'Color', 'Silver', 'VTX-SW-015-SV', 20);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('atlas-duffel-40l', 'Atlas Duffel 40L', 'Carry-on sized duffel with a separate shoe compartment, weatherproof zipper, and stowable straps.', cat_accessories, b_atlas, 135.00, 170.00, 'ATL-DF-016', 4.6, 117, 44, false, true, ARRAY['travel','waterproof','carryon'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1661530/pexels-photo-1661530.jpeg?auto=compress&cs=tinysrgb&w=900', 'Atlas Duffel 40L', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Black', 'ATL-DF-016-BK', 20), (p, 'Color', 'Navy', 'ATL-DF-016-NV', 24);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('lumen-wool-throw', 'Lumen Wool Throw', 'Soft lambswool throw with hand-finished fringe. Woven on heritage looms in a muted natural palette.', cat_home, b_lumen, 145.00, NULL, 'LUM-WT-017', 4.9, 58, 22, false, true, ARRAY['new','wool','decor'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/6585757/pexels-photo-6585757.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Wool Throw', 0);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('cove-cashmere-scarf', 'Cove Cashmere Scarf', 'Featherweight grade-A cashmere scarf woven to a generous, wrap-friendly size. Exceptionally soft.', cat_accessories, b_cove, 125.00, 160.00, 'COV-CS-018', 4.8, 84, 33, false, true, ARRAY['luxury','cashmere','winter'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Cashmere Scarf', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Camel', 'COV-CS-018-CM', 12), (p, 'Color', 'Charcoal', 'COV-CS-018-CH', 12),
    (p, 'Color', 'Ivory', 'COV-CS-018-IV', 9);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('aurora-selvedge-denim', 'Aurora Selvedge Denim', '14oz Japanese selvedge denim with a slim-straight leg. Built to break in and last for years.', cat_bottoms, b_aurora, 175.00, 220.00, 'AUR-SD-019', 4.7, 131, 28, false, true, ARRAY['bestseller','denim','selvedge'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=900', 'Aurora Selvedge Denim', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', '30', 'AUR-SD-019-30', 4), (p, 'Size', '32', 'AUR-SD-019-32', 8),
    (p, 'Size', '34', 'AUR-SD-019-34', 8), (p, 'Size', '36', 'AUR-SD-019-36', 8);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('nimbus-trail-runner-gtx', 'Nimbus Trail Runner GTX', 'Gore-Tex membrane, aggressive 5mm lugs, and a rock plate for technical terrain in any weather.', cat_sneakers, b_nimbus, 175.00, 215.00, 'NIM-TR-020', 4.7, 156, 42, false, true, ARRAY['new','trail','waterproof','gtx'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/277390/pexels-photo-277390.jpeg?auto=compress&cs=tinysrgb&w=900', 'Nimbus Trail Runner GTX', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', '8', 'NIM-TR-020-8', 5), (p, 'Size', '9', 'NIM-TR-020-9', 10),
    (p, 'Size', '10', 'NIM-TR-020-10', 12), (p, 'Size', '11', 'NIM-TR-020-11', 8);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('vertex-mechanical-keyboard', 'Vertex Mechanical Keyboard', 'Hot-swappable 75% layout with gasket mount, PBT keycaps, and per-key RGB. Wired and 2.4G modes.', cat_electronics, b_vertex, 189.00, 229.00, 'VTX-MK-021', 4.8, 219, 30, false, true, ARRAY['new','keyboard','mechanical'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg?auto=compress&cs=tinysrgb&w=900', 'Vertex Mechanical Keyboard', 0);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('atlas-sling-6l', 'Atlas Sling 6L', 'Compact 6L sling with a hidden security pocket and quick-release buckle. Everyday carry, simplified.', cat_accessories, b_atlas, 69.00, 89.00, 'ATL-SL-022', 4.5, 88, 60, false, true, ARRAY['new','edc','sling'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1202274/pexels-photo-1202274.jpeg?auto=compress&cs=tinysrgb&w=900', 'Atlas Sling 6L', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Color', 'Black', 'ATL-SL-022-BK', 30), (p, 'Color', 'Sand', 'ATL-SL-022-SD', 30);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('lumen-brass-candleholder', 'Lumen Brass Candleholder', 'Solid brass candleholder with a brushed finish. Pairs in graduating heights for a sculptural tablescape.', cat_home, b_lumen, 42.00, NULL, 'LUM-BCH-023', 4.6, 47, 35, false, true, ARRAY['new','brass','decor'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/4207791/pexels-photo-4207791.jpeg?auto=compress&cs=tinysrgb&w=900', 'Lumen Brass Candleholder', 0);

  INSERT INTO products (slug, title, description, category_id, brand_id, price, compare_at_price, sku, rating, rating_count, inventory_count, is_featured, is_active, tags)
  VALUES ('cove-tailored-trouser', 'Cove Tailored Trouser', 'Italian wool-blend trouser with a clean taper and extended waistband tab. Effortlessly sharp.', cat_bottoms, b_cove, 185.00, 230.00, 'COV-TT-024', 4.7, 63, 26, false, true, ARRAY['new','wool','tailored'])
  ON CONFLICT (slug) DO NOTHING RETURNING id INTO p;
  INSERT INTO product_images (product_id, url, alt_text, position) VALUES
    (p, 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=900', 'Cove Tailored Trouser', 0);
  INSERT INTO product_variants (product_id, name, value, sku, inventory_count) VALUES
    (p, 'Size', '30', 'COV-TT-024-30', 5), (p, 'Size', '32', 'COV-TT-024-32', 8),
    (p, 'Size', '34', 'COV-TT-024-34', 8), (p, 'Size', '36', 'COV-TT-024-36', 5);
END $$;

-- Editorial seed reviews (NULL user_id = no owner, read-only)
INSERT INTO reviews (product_id, author_name, rating, title, body, is_approved)
SELECT p.id, 'Jordan M.', 5, 'My new everyday shoe', 'Comfortable from the first wear and the build quality is outstanding.', true
FROM products p WHERE p.slug = 'nimbus-cloud-runner'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = p.id AND author_name = 'Jordan M.')
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, author_name, rating, title, body, is_approved)
SELECT p.id, 'Priya S.', 4, 'Great sound, snug fit', 'Noise cancellation is excellent. Slightly tight for long sessions but loosens up.', true
FROM products p WHERE p.slug = 'vertex-over-ear-headphones'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = p.id AND author_name = 'Priya S.')
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, author_name, rating, title, body, is_approved)
SELECT p.id, 'Daniel R.', 5, 'Worth every penny', 'The merino is impossibly soft and it regulates temperature perfectly on flights.', true
FROM products p WHERE p.slug = 'aurora-merino-crew'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = p.id AND author_name = 'Daniel R.')
ON CONFLICT DO NOTHING;

INSERT INTO reviews (product_id, author_name, rating, title, body, is_approved)
SELECT p.id, 'Lena K.', 5, 'Beautiful warm light', 'The dimming range is perfect and the brass base feels substantial.', true
FROM products p WHERE p.slug = 'lumen-desk-lamp'
AND NOT EXISTS (SELECT 1 FROM reviews WHERE product_id = p.id AND author_name = 'Lena K.')
ON CONFLICT DO NOTHING;
