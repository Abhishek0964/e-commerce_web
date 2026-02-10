import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// GET - List wishlist items for authenticated user
export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch wishlist items with product details using correct column names
        const { data, error } = await supabase
            .from('wishlists')
            .select(`
        id,
        product_id,
        created_at,
        products (
          id,
          name,
          slug,
          price,
          images,
          is_active,
          category_id,
          categories (
            name
          )
        )
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Wishlist fetch error:', error);
            return NextResponse.json({ success: false, error: 'Failed to fetch wishlist' }, { status: 500 });
        }

        // Transform data - use products.images JSONB field (not product_images table)
        const wishlistItems = (data || []).map((item: any) => {
            const product = item.products;
            const images = product?.images || [];
            const firstImage = Array.isArray(images) && images.length > 0 ? images[0] : null;
            // images could be array of strings or array of objects
            const imageUrl = typeof firstImage === 'string'
                ? firstImage
                : firstImage?.url || firstImage?.image_url || null;

            return {
                id: item.id,
                product_id: item.product_id,
                product_name: product?.name || '',
                product_slug: product?.slug || '',
                product_price: product?.price || 0,
                product_image: imageUrl,
                product_is_active: product?.is_active ?? false,
                category_name: product?.categories?.name || null,
                created_at: item.created_at,
            };
        });

        return NextResponse.json({ success: true, data: wishlistItems });
    } catch (error: any) {
        console.error('Wishlist GET error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}

// POST - Add item to wishlist
export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { product_id } = body;

        if (!product_id) {
            return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
        }

        // Check for duplicates
        const { data: existing } = await supabase
            .from('wishlists')
            .select('id')
            .eq('user_id', user.id)
            .eq('product_id', product_id)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ success: false, error: 'Already in wishlist' }, { status: 409 });
        }

        const { data, error } = await supabase
            .from('wishlists')
            .insert({ user_id: user.id, product_id })
            .select()
            .single();

        if (error) {
            console.error('Wishlist add error:', error);
            return NextResponse.json({ success: false, error: 'Failed to add to wishlist' }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error: any) {
        console.error('Wishlist POST error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const product_id = searchParams.get('product_id');

        if (!product_id) {
            return NextResponse.json({ success: false, error: 'Product ID is required' }, { status: 400 });
        }

        const { error } = await supabase
            .from('wishlists')
            .delete()
            .eq('user_id', user.id)
            .eq('product_id', product_id);

        if (error) {
            console.error('Wishlist delete error:', error);
            return NextResponse.json({ success: false, error: 'Failed to remove from wishlist' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Wishlist DELETE error:', error);
        return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
    }
}
