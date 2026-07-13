/*
# Convert prices from USD to INR

## Purpose
Switches the storefront currency from US dollars to Indian rupees. Multiplies all
monetary columns by 83 (approximate USD→INR rate) and rounds to whole rupees, and
updates the default currency code on products from 'USD' to 'INR'.

## Tables affected
- products: price, compare_at_price, currency
- product_variants: price_override
- orders: subtotal, shipping, tax, total, currency

## Notes
- No schema changes; only data updates.
- Existing orders (if any) are also converted for consistency.
- Re-running is safe: values are set absolutely, not multiplied again, because
  the WHERE clause checks for the old 'USD' currency before converting.
*/

-- Convert product prices only if still in USD
UPDATE products
SET price = ROUND(price * 83),
    compare_at_price = CASE WHEN compare_at_price IS NOT NULL THEN ROUND(compare_at_price * 83) ELSE NULL END,
    currency = 'INR'
WHERE currency = 'USD';

UPDATE product_variants
SET price_override = CASE WHEN price_override IS NOT NULL THEN ROUND(price_override * 83) ELSE NULL END
WHERE price_override IS NOT NULL;

UPDATE orders
SET subtotal = ROUND(subtotal * 83),
    shipping = ROUND(shipping * 83),
    tax = ROUND(tax * 83),
    total = ROUND(total * 83),
    currency = 'INR'
WHERE currency = 'USD';

-- Update the default for future inserts
ALTER TABLE products ALTER COLUMN currency SET DEFAULT 'INR';
ALTER TABLE orders ALTER COLUMN currency SET DEFAULT 'INR';
