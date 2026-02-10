import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, errorResponse, successResponse } from '@/lib/admin-utils';
import { productSchema } from '@/lib/validations/admin';
import { z } from 'zod';

/**
 * GET /api/admin/products/[id]
 * Get single product by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        const { data: product, error } = await supabase
            .from('products')
            .select('*, category:categories(id, name), product_images(id, image_url, display_order, alt_text)')
            .eq('id', params.id)
            .single();

        if (error) throw error;
        if (!product) {
            return errorResponse('Product not found', 404);
        }

        return successResponse(product);
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return errorResponse('Failed to fetch product', 500, error.message);
    }
}

/**
 * PUT /api/admin/products/[id]
 * Update product
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        const body = await request.json();

        // Validate input
        const validatedData = productSchema.partial().parse(body);

        // Update product
        const { data: product, error } = await supabase
            .from('products')
            .update({
                ...validatedData,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;
        if (!product) {
            return errorResponse('Product not found', 404);
        }

        return successResponse(product);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return errorResponse('Validation failed', 400, error.errors);
        }
        console.error('Error updating product:', error);
        return errorResponse('Failed to update product', 500, error.message);
    }
}

/**
 * DELETE /api/admin/products/[id]
 * Soft delete product (set is_active = false)
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        // Soft delete by setting is_active to false
        const { data: product, error } = await supabase
            .from('products')
            .update({ is_active: false, updated_at: new Date().toISOString() })
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;
        if (!product) {
            return errorResponse('Product not found', 404);
        }

        return successResponse({ message: 'Product deleted successfully', product });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return errorResponse('Failed to delete product', 500, error.message);
    }
}
