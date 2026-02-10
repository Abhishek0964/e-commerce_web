-- Create product_images table for multiple images per product
-- This allows products to have image galleries instead of single image

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for fast product image lookups
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(product_id, display_order);

-- Add RLS policies
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access to product images
CREATE POLICY "Product images are viewable by everyone"
  ON product_images FOR SELECT
  USING (true);

-- Allow authenticated users to insert product images (will be restricted to admin in API)
CREATE POLICY "Authenticated users can insert product images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update product images
CREATE POLICY "Authenticated users can update product images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
  ON product_images FOR DELETE
  TO authenticated
  USING (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_product_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW
  EXECUTE FUNCTION update_product_images_updated_at();

-- Comment on table
COMMENT ON TABLE product_images IS 'Stores multiple images for each product';
COMMENT ON COLUMN product_images.display_order IS 'Order in which images should be displayed (0 is primary)';
