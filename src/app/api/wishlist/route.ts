import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - List wishlist items for authenticated user
export async function GET() {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Fetch wishlist items with product details
        const { data, error } = await supabase
            .from('wishlists')
            .select(`
        id,
        product_id,
        created_at,
        products:product_id (
          id,
          name,
          slug,
          price,
          is_active,
          categories:category_id (
            name
          ),
          product_images (
            url,
            alt,
            display_order
          )
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Wishlist fetch error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to fetch wishlist' },
                { status: 500 }
            );
        }

        // Transform data to match frontend expectations
        const wishlistItems = data?.map((item: any) => ({
            id: item.id,
            product_id: item.product_id,
            product_name: item.products?.name || '',
            product_slug: item.products?.slug || '',
            product_price: item.products?.price || 0,
            product_image: item.products?.product_images?.[0]?.url || null,
            product_is_active: item.products?.is_active || false,
            category_name: item.products?.categories?.name || null,
            created_at: item.created_at
        })) || [];

        return NextResponse.json({
            success: true,
            data: wishlistItems
        });

    } catch (error: any) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST - Add item to wishlist
export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { product_id } = body;

        if (!product_id) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Check if already in wishlist
        const { data: existing } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product_id)
            .single();

        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Product already in wishlist' },
                { status: 409 }
            );
        }

        // Add to wishlist
        const { data, error } = await supabase
            .from('wishlists')
            .insert({
                user_id: user.id,
                product_id
            })
            .select()
            .single();

        if (error) {
            console.error('Wishlist add error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to add to wishlist' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            data
        });

    } catch (error: any) {
        console.error('Wishlist POST error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();

        // Check authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const product_id = searchParams.get('product_id');

        if (!product_id) {
            return NextResponse.json(
                { success: false, error: 'Product ID is required' },
                { status: 400 }
            );
        }

        // Remove from wishlist
        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product_id);

        if (error) {
            console.error('Wishlist delete error:', error);
            return NextResponse.json(
                { success: false, error: 'Failed to remove from wishlist' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true
        });

    } catch (error: any) {
        console.error('Wishlist DELETE error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
