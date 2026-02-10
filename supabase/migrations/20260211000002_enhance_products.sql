-- Add additional columns to products table for better admin management

-- Add SKU column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='sku') THEN
    ALTER TABLE products ADD COLUMN sku VARCHAR(100) UNIQUE;
  END IF;
END $$;

-- Add compare_price column for showing discounts (original price)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='compare_price') THEN
    ALTER TABLE products ADD COLUMN compare_price DECIMAL(10,2);
  END IF;
END $$;

-- Add tags column for product categorization
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='products' AND column_name='tags') THEN
    ALTER TABLE products ADD COLUMN tags TEXT[];
  END IF;
END $$;

-- Create index on tags for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

-- Create index on SKU for fast lookups
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);

-- Update comments
COMMENT ON COLUMN products.sku IS 'Stock Keeping Unit - unique product identifier';
COMMENT ON COLUMN products.compare_price IS 'Original price before discount (optional)';
COMMENT ON COLUMN products.tags IS 'Product tags for categorization and filtering';
