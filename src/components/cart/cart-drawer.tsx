'use client';

import * as React from 'react';
import { useCartStore } from '@/store/cart';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { CartList } from './cart-list';
import { CartSummary } from './cart-summary';
import { ShoppingCart } from 'lucide-react';

export function CartDrawer() {
    const isOpen = useCartStore((state) => state.isOpen);
    const closeDrawer = useCartStore((state) => state.closeDrawer);
    const items = useCartStore((state) => state.items);

    // Hydration fix
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
        // Trigger hydration manually if needed, or rely on persist's onRehydrateStorage
        // Zustand persist usually auto-hydrates on client.
        // We just ensure we don't render mismatching content.
        useCartStore.persist.rehydrate();
    }, []);

    if (!isMounted) return null;

    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && closeDrawer()}>
            <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
                <SheetHeader className="px-1">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Type Shopping Cart
                        <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-normal text-secondary-foreground">
                            {itemCount}
                        </span>
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                        Review your selected items before checkout.
                    </SheetDescription>
                </SheetHeader>

                {/* Scrollable List Area */}
                <div className="flex-1 overflow-y-auto pr-6">
                    <CartList />
                </div>

                {/* Fixed Footer Area */}
                <div className="pr-6 pt-4">
                    <CartSummary />
                </div>
            </SheetContent>
        </Sheet>
    );
}
