import { createClient } from './supabase/server';
import type {
    Category,
    ProductWithDetails,
    ProductFilters,
    PaginationParams,
    ProductListResponse
} from '@/types/product';

import { getSearchProvider } from './search';

/**
 * Get products with optional filters and pagination
 * Uses the configured SearchProvider (default: Supabase)
 */
export async function getProducts(
    filters?: ProductFilters,
    pagination?: PaginationParams
): Promise<ProductListResponse> {
    const provider = getSearchProvider();
    return provider.search(filters || {}, pagination || { page: 1, limit: 12 });
}

/**
 * Get a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<ProductWithDetails | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            inventory(*)
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .is('deleted_at', null)
        .maybeSingle();

    if (error || !data) {
        if (error) console.error('Error fetching product:', error);
        return null;
    }

    const productData = data as any;
    return {
        ...productData,
        available_stock: productData.inventory?.quantity - productData.inventory?.reserved || 0,
    } as ProductWithDetails;
}

/**
 * Get featured products for home page
 */
export async function getFeaturedProducts(limit: number = 6): Promise<ProductWithDetails[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            inventory(*)
        `)
        .eq('is_featured', true)
        .eq('is_active', true)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('Error fetching featured products:', error);
        return [];
    }

    return (data || []).map((product: any) => ({
        ...product,
        available_stock: product.inventory?.quantity - product.inventory?.reserved || 0,
    })) as ProductWithDetails[];
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

    if (error || !data) {
        if (error) console.error('Error fetching category:', error);
        return null;
    }

    return data as Category;
}
