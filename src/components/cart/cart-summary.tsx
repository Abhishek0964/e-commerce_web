'use client';

import { useCartStore } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function CartSummary() {
    const items = useCartStore((state) => state.items);
    const getSubtotal = useCartStore((state) => state.getSubtotal);
    const closeDrawer = useCartStore((state) => state.closeDrawer);

    if (items.length === 0) return null;

    const subtotal = getSubtotal();
    const isFreeShipping = subtotal >= 1000;
    const shippingCost = isFreeShipping ? 0 : 50;
    const total = subtotal + shippingCost;

    return (
        <div className="space-y-4 rounded-lg bg-secondary/30 p-4">
            <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{isFreeShipping ? 'Free' : formatPrice(shippingCost)}</span>
                </div>
                {!isFreeShipping && (
                    <p className="text-xs text-muted-foreground">
                        Add {formatPrice(1000 - subtotal)} more for free shipping
                    </p>
                )}
            </div>

            <Separator />

            <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
            </div>

            <div className="space-y-2 pt-2">
                <Button className="w-full" size="lg" onClick={() => console.log('Proceed to Checkout')}>
                    Checkout
                </Button>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={closeDrawer}
                >
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
