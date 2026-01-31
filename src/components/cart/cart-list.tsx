'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cart';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from './cart-item';
import { AnimatePresence, motion } from 'framer-motion';

export function CartList() {
    const items = useCartStore((state) => state.items);
    const closeDrawer = useCartStore((state) => state.closeDrawer);

    if (items.length === 0) {
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

    return (
        <ul className="flex flex-col gap-4 py-4">
            <AnimatePresence initial={false}>
                {items.map((item) => (
                    <motion.li
                        key={item.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <CartItem item={item} />
                    </motion.li>
                ))}
            </AnimatePresence>
        </ul>
    );
}
