import { createClient } from './supabase/server';
import type { ProductWithDetails, ProductFilters, PaginationParams, ProductListResponse } from '@/types/product';

/**
 * Filter extension to include sorting
 */
export interface ProductSearchFilters extends ProductFilters {
    sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

/**
 * Interface for search providers (e.g., Supabase FTS, Algolia, MeiliSearch)
 */
export interface SearchProvider {
    search(filters: ProductSearchFilters, pagination: PaginationParams): Promise<ProductListResponse>;
}

/**
 * Default Supabase Search Provider
 * Uses Postgres ILIKE or FTS depending on configuration
 */
export class SupabaseSearchProvider implements SearchProvider {
    async search(
        filters: ProductSearchFilters,
        pagination: PaginationParams = { page: 1, limit: 12 }
    ): Promise<ProductListResponse> {
        const supabase = await createClient();
        const page = Math.max(1, pagination.page || 1);
        const limit = Math.max(1, pagination.limit || 12);
        const offset = (page - 1) * limit;

        // Start building query
        let query = supabase
            .from('products')
            .select(`
        *,
        category:categories(*),
        inventory(*)
      `, { count: 'exact' })
            .eq('is_active', true)
            .is('deleted_at', null);

        // 1. Text Search (Name & Description)
        // Using ILIKE as default fallback for simplicity without dedicated FTS column setup
        if (filters.search) {
            const term = filters.search.trim();
            if (term) {
                query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
            }
        }

        // 2. Category Filter
        if (filters.category) {
            // If category is a slug, we might need to resolve it first or assume ID
            // For now assuming ID based on existing patterns, but good to double check
            // Ideally this accepts UUID. If UI passes slug, we need a lookup.
            // Let's stick to strict matching for now.
            query = query.eq('category_id', filters.category);
        }

        // 3. Price Range
        if (filters.min_price !== undefined) {
            query = query.gte('price', filters.min_price);
        }
        if (filters.max_price !== undefined) {
            query = query.lte('price', filters.max_price);
        }

        // 4. Featured
        if (filters.is_featured !== undefined) {
            query = query.eq('is_featured', filters.is_featured);
        }

        // 5. Sorting
        switch (filters.sort) {
            case 'price-asc':
                query = query.order('price', { ascending: true });
                break;
            case 'price-desc':
                query = query.order('price', { ascending: false });
                break;
            case 'name-asc':
                query = query.order('name', { ascending: true });
                break;
            case 'name-desc':
                query = query.order('name', { ascending: false });
                break;
            case 'newest':
            default:
                query = query.order('created_at', { ascending: false });
                break;
        }

        // 6. Pagination
        query = query.range(offset, offset + limit - 1);

        // Execute
        const { data, error, count } = await query;

        if (error) {
            console.error('Supabase Search Error:', error);
            throw new Error('Failed to search products');
        }

        // Transform Result
        const products = (data || []).map((product: any) => ({
            ...product,
            available_stock: (product.inventory?.quantity || 0) - (product.inventory?.reserved || 0),
        })) as ProductWithDetails[];

        return {
            products,
            total: count || 0,
            page,
            limit,
            totalPages: Math.ceil((count || 0) / limit),
        };
    }
}

// Singleton instance factory
export function getSearchProvider(): SearchProvider {
    // In future we can return AlgoliaSearchProvider based on ENV
    return new SupabaseSearchProvider();
}
