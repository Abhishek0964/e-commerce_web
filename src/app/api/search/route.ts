import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/admin-utils';

/**
 * GET /api/search
 * Search products using MeiliSearch with fallback to Supabase
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category');
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const inStock = searchParams.get('in_stock');
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    // For now, use Supabase fallback
    // TODO: Integrate MeiliSearch when it's configured and indexed
    const supabase = await createClient();

    try {
        let dbQuery = supabase
            .from('products')
            .select('*, category:categories(id, name), product_images(id, image_url, display_order)', { count: 'exact' })
            .eq('is_active', true);

        // Search filter
        if (query) {
            dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`);
        }

        // Category filter
        if (category) {
            dbQuery = dbQuery.eq('category_id', category);
        }

        // Price range filters
        if (minPrice) {
            dbQuery = dbQuery.gte('price', parseFloat(minPrice));
        }
        if (maxPrice) {
            dbQuery = dbQuery.lte('price', parseFloat(maxPrice));
        }

        // In stock filter
        if (inStock === 'true') {
            dbQuery = dbQuery.gt('stock', 0);
        }

        // Pagination
        const start = (page - 1) * perPage;
        dbQuery = dbQuery.range(start, start + perPage - 1);

        // Default sort by relevance (created_at for now)
        dbQuery = dbQuery.order('created_at', { ascending: false });

        const { data, error, count } = await dbQuery;

        if (error) throw error;

        // Format results to match expected search response
        const results = (data || []).map(product => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            description: product.description,
            price: product.price,
            image_url: product.product_images?.[0]?.image_url || product.image_url,
            category: product.category?.name,
            stock: product.stock,
        }));

        return successResponse({
            results,
            pagination: {
                page,
                per_page: perPage,
                total: count || 0,
                total_pages: Math.ceil((count || 0) / perPage),
            },
            query,
            filters: {
                category,
                min_price: minPrice,
                max_price: maxPrice,
                in_stock: inStock,
            },
        });
    } catch (error: any) {
        console.error('Search error:', error);
        return errorResponse('Search failed', 500, error.message);
    }
}
