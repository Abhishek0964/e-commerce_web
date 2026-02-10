import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, errorResponse, successResponse } from '@/lib/admin-utils';
import { productSchema } from '@/lib/validations/admin';
import { z } from 'zod';

/**
 * GET /api/admin/products
 * List all products with search and pagination
 */
export async function GET(request: NextRequest) {
    const adminCheck = await verifyAdmin();
    if (admin Check instanceof NextResponse) return adminCheck;

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Parse query params
    const query = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');
    const sortBy = searchParams.get('sort_by') || 'created_desc';
    const categoryId = searchParams.get('category_id');

    try {
        let dbQuery = supabase
            .from('products')
            .select('*, category:categories(id, name), product_images(id, image_url, display_order)', { count: 'exact' });

        // Apply search filter
        if (query) {
            dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`);
        }

        // Apply category filter
        if (categoryId) {
            dbQuery = dbQuery.eq('category_id', categoryId);
        }

        // Apply sorting
        const [sortField, sortDir] = sortBy.split('_');
        const ascending = sortDir === 'asc';
        dbQuery = dbQuery.order(sortField === 'created' ? 'created_at' : sortField, { ascending });

        // Apply pagination
        const start = (page - 1) * perPage;
        dbQuery = dbQuery.range(start, start + perPage - 1);

        const { data, error, count } = await dbQuery;

        if (error) throw error;

        return successResponse({
            products: data,
            pagination: {
                page,
                per_page: perPage,
                total: count || 0,
                total_pages: Math.ceil((count || 0) / perPage),
            },
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return errorResponse('Failed to fetch products', 500, error.message);
    }
}

/**
 * POST /api/admin/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        const body = await request.json();

        // Validate input
        const validatedData = productSchema.parse(body);

        // Create product
        const { data: product, error } = await supabase
            .from('products')
            .insert([validatedData])
            .select()
            .single();

        if (error) throw error;

        return successResponse(product, 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return errorResponse('Validation failed', 400, error.errors);
        }
        console.error('Error creating product:', error);
        return errorResponse('Failed to create product', 500, error.message);
    }
}
