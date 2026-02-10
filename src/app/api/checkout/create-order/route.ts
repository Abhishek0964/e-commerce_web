import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { razorpay } from '@/lib/razorpay';
import { env } from '@/validators/env';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { items, addressId } = await request.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'No items in order' }, { status: 400 });
        }

        if (!addressId) {
            return NextResponse.json({ error: 'Address required' }, { status: 400 });
        }

        // 1. Calculate Total (Fetch prices from DB to be secure)
        const productIds = items.map((i: any) => i.productId);
        const { data: products } = await supabase
            .from('products')
            .select('id, price')
            .in('id', productIds);

        const priceMap = new Map(products?.map((p: any) => [p.id, p.price]));

        let totalAmount = 0;
        const validatedItems = items.map((item: any) => {
            const price = priceMap.get(item.productId);
            if (!price) throw new Error(`Product ${item.productId} not found`);
            totalAmount += price * item.quantity;
            return { ...item, price }; // Store price for order_items
        });

        // 2. Create Razorpay Order
        // Amount is in paisa (integer)
        const options = {
            amount: Math.round(totalAmount * 100),
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${user.id.slice(0, 5)}`,
        };

        const order = await razorpay.orders.create(options);

        // 3. Create DB Order (Pending)
        // Fetch address snapshot to store permanently with order
        const { data: address } = await supabase
            .from('addresses')
            .select('*')
            .eq('id', addressId)
            .single();

        if (!address) throw new Error('Address not found');

        // Create Order
        const { data: dbOrder, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: user.id,
                status: 'pending',
                total_amount: totalAmount,
                razorpay_order_id: order.id,
                shipping_address_line1: address.address_line1,
                shipping_address_line2: address.address_line2,
                shipping_city: address.city,
                shipping_state: address.state,
                shipping_pincode: address.pincode,
                shipping_name: address.full_name,
                shipping_phone: address.phone,
                payment_status: 'pending'
            })
            .select()
            .single();

        if (orderError) throw orderError;

        // 4. Insert Order Items
        const orderItemsData = validatedItems.map((item: any) => ({
            order_id: dbOrder.id,
            product_id: item.productId,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
            product_name: 'Product' // Ideally fetch name too, but schema might require it. checked: schema has product_name
        }));

        // RE-FETCH products names to satisfy schema if needed
        const { data: productDetails } = await supabase
            .from('products')
            .select('id, name, images')
            .in('id', productIds);

        const productDetailMap = new Map(productDetails?.map((p: any) => [p.id, p]));

        const finalOrderItems = orderItemsData.map((item: any) => {
            const detail = productDetailMap.get(item.product_id);
            return {
                ...item,
                product_name: detail?.name || 'Unknown Product',
                product_image: detail?.images?.[0] || null
            };
        });

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(finalOrderItems);

        if (itemsError) throw itemsError;

        return NextResponse.json({
            orderId: order.id, // Razorpay Order ID
            dbOrderId: dbOrder.id,
            amount: totalAmount,
            currency: 'INR',
            keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID
        });

    } catch (error: any) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
