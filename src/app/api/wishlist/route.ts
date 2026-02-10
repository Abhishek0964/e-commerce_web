import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { errorResponse, successResponse } from '@/lib/admin-utils';
import { wishlistSchema } from '@/lib/validations/admin';
import { z } from 'zod';

/**
 * GET /api/wishlist
 * Get user's wishlist items
 */
export async function GET(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const { data: wishlist, error } = await supabase
            .from('wishlist_with_products')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return successResponse(wishlist || []);
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);
        return errorResponse('Failed to fetch wishlist', 500, error.message);
    }
}

/**
 * POST /api/wishlist
 * Add item to wishlist
 */
export async function POST(request: NextRequest) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const body = await request.json();

        // Validate input
        const validatedData = wishlistSchema.parse(body);

        // Add to wishlist
        const { data: wishlistItem, error } = await supabase
            .from('wishlists')
            .insert([{
                user_id: user.id,
                product_id: validatedData.product_id,
            }])
            .select()
            .single();

        if (error) {
            // Check if already in wishlist
            if (error.code === '23505') {
                return errorResponse('Product already in wishlist', 409);
            }
            throw error;
        }

        return successResponse(wishlistItem, 201);
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return errorResponse('Validation failed', 400, error.errors);
        }
        console.error('Error adding to wishlist:', error);
        return errorResponse('Failed to add to wishlist', 500, error.message);
    }
}

/**
 * DELETE /api/wishlist/[id]
 * Remove item from wishlist
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return errorResponse('Unauthorized', 401);
    }

    try {
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('id', params.id)
            .eq('user_id', user.id);

        if (error) throw error;

        return successResponse({ message: 'Item removed from wishlist' });
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);
        return errorResponse('Failed to remove from wishlist', 500, error.message);
    }
}
