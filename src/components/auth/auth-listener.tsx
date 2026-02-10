'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';

export function AuthListener() {
    const { user } = useAuth();
    const { items, clearCart } = useCartStore();

    useEffect(() => {
        const mergeCart = async () => {
            // Only merge if user is logged in AND there are local items
            if (user && items.length > 0) {
                try {
                    // Prepare payload
                    const payload = {
                        items: items.map(i => ({
                            productId: i.id,
                            quantity: i.quantity
                        }))
                    };

                    const res = await fetch('/api/cart/merge', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!res.ok) throw new Error('Failed to merge cart');

                    toast.success('Cart merged with your account');
                    clearCart(); // Clear local state, next fetch from DB will populate it (TODO: Sync DB cart)
                    // Ideally, we should now FETCH the cart from DB and update store.
                    // But for now, we clear local.
                } catch (error) {
                    console.error('Cart merge failed', error);
                }
            }
        };

        mergeCart();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]); // Run when user changes (login)

    return null;
}
