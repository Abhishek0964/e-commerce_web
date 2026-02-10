import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/validators/env';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            dbOrderId
        } = await request.json();

        // 1. Verify Signature
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // 2. Update DB Order to Confirmed/Paid
        // Note: 'payment_status' and 'status' fields based on schema.
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'confirmed', // or 'processing'
                payment_status: 'paid',
                razorpay_payment_id: razorpay_payment_id,
                razorpay_signature: razorpay_signature,
                paid_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('id', dbOrderId)
            .eq('user_id', user.id); // Security check

        if (updateError) throw updateError;

        // 3. Clear Cart (DB)
        const { error: cartError } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', user.id);

        if (cartError) {
            console.error("Failed to clear cart:", cartError);
            // Don't fail the request, just log it. Payment is success.
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('Payment verification failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
