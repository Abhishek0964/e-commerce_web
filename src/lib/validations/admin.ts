import { z } from 'zod';

/**
 * Validation schemas for admin product management
 */

// Product create/update schema
export const productSchema = z.object({
    name: z.string().min(1, 'Product name is required').max(200, 'Name too long'),
    slug: z.string().min(1, 'Slug is required').max(200, 'Slug too long')
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long'),
    price: z.number().positive('Price must be positive').max(10000000, 'Price too high'),
    compare_price: z.number().positive().max(10000000).optional().nullable(),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    category_id: z.string().uuid('Invalid category ID'),
    sku: z.string().min(1, 'SKU is required').max(100, 'SKU too long').optional().nullable(),
    tags: z.array(z.string()).max(20, 'Too many tags').optional().nullable(),
    is_active: z.boolean().optional().default(true),
});

export type ProductInput = z.infer<typeof productSchema>;

// Product image schema
export const productImageSchema = z.object({
    product_id: z.string().uuid('Invalid product ID'),
    image_url: z.string().url('Invalid image URL'),
    display_order: z.number().int().min(0).optional().default(0),
    alt_text: z.string().max(200).optional().nullable(),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;

// Wishlist item schema
export const wishlistSchema = z.object({
    product_id: z.string().uuid('Invalid product ID'),
});

export type WishlistInput = z.infer<typeof wishlistSchema>;

// Product search/filter schema
export const productSearchSchema = z.object({
    q: z.string().max(200).optional(),
    category_id: z.string().uuid().optional(),
    min_price: z.number().positive().optional(),
    max_price: z.number().positive().optional(),
    in_stock: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    page: z.number().int().positive().optional().default(1),
    per_page: z.number().int().min(1).max(100).optional().default(20),
    sort_by: z.enum(['name_asc', 'name_desc', 'price_asc', 'price_desc', 'created_asc', 'created_desc']).optional().default('created_desc'),
});

export type ProductSearchParams = z.infer<typeof productSearchSchema>;
