import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { verifyAdmin, errorResponse, successResponse } from '@/lib/admin-utils';
import { productImageSchema } from '@/lib/validations/admin';
import { z } from 'zod';

/**
 * POST /api/admin/products/[id]/images
 * Add product image
 */
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        const body = await request.json();

        // Validate input
        const validatedData = productImageSchema.parse({
            ...body,
            product_id: params.id,
        });

        // Insert product image
        const { data: image, error } = await supabase
            .from('product_images')
            .insert([validatedData])
            .select()
            .single();

        if (error) throw error;

        return successResponse(image, 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return errorResponse('Validation failed', 400, error.errors);
        }
        console.error('Error adding product image:', error);
        return errorResponse('Failed to add product image', 500, error.message);
    }
}

/**
 * DELETE /api/admin/products/[id]/images/[imageId]
 * Delete product image
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; imageId: string } }
) {
    const adminCheck = await verifyAdmin();
    if (adminCheck instanceof NextResponse) return adminCheck;

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from('product_images')
            .delete()
            .eq('id', params.imageId)
            .eq('product_id', params.id);

        if (error) throw error;

        return successResponse({ message: 'Image deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting product image:', error);
        return errorResponse('Failed to delete image', 500, error.message);
    }
}
