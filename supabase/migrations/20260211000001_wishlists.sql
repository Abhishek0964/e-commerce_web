-- Create wishlists table for user wishlist functionality
-- Allows users to save products for later

CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure a user can only add a product to wishlist once
  UNIQUE(user_id, product_id)
);

-- Create indexes for fast lookups
CREATE INDEX idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX idx_wishlists_product_id ON wishlists(product_id);
CREATE INDEX idx_wishlists_user_product ON wishlists(user_id, product_id);

-- Add RLS policies
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Users can only see their own wishlist items
CREATE POLICY "Users can view their own wishlist"
  ON wishlists FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can only insert their own wishlist items
CREATE POLICY "Users can insert their own wishlist items"
  ON wishlists FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own wishlist items
CREATE POLICY "Users can delete their own wishlist items"
  ON wishlists FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Comment on table
COMMENT ON TABLE wishlists IS 'Stores user wishlist items (saved products)';

-- Create a view for wishlist with product details
CREATE OR REPLACE VIEW wishlist_with_products AS
SELECT 
  w.id,
  w.user_id,
  w.product_id,
  w.created_at,
  p.name AS product_name,
  p.slug AS product_slug,
  p.price AS product_price,
  p.image_url AS product_image,
  p.stock AS product_stock,
  p.is_active AS product_is_active,
  c.name AS category_name
FROM wishlists w
JOIN products p ON w.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id;

-- Grant access to the view
GRANT SELECT ON wishlist_with_products TO authenticated;
