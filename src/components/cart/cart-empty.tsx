'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';

export function CartEmpty() {
    const closeDrawer = useCartStore((state) => state.closeDrawer);

    return (
        <div className="flex h-full flex-col items-center justify-center space-y-4 pt-16 text-center">
            <div className="rounded-full bg-secondary p-4 text-muted-foreground">
                <ShoppingBag className="h-8 w-8" />
            </div>
            <div>
                <h3 className="text-lg font-semibold">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground">
                    Looks like you haven&apos;t added anything yet.
                </p>
            </div>
            <Button onClick={closeDrawer} asChild className="mt-4">
                <Link href="/products">
                    Start Shopping
                </Link>
            </Button>
        </div>
    );
}
