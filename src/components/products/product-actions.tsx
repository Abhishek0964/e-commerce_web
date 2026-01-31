'use client';

import { useState } from 'react';
import { QuantitySelector } from './quantity-selector';
import { AddToCartButton } from './add-to-cart-button';
import { useCartStore } from '@/store/cart';
import type { ProductWithDetails } from '@/types/product';

interface ProductActionsProps {
    product: ProductWithDetails;
}

export function ProductActions({ product }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    // Calculate stock dynamically based on max
    const maxStock = (product.inventory?.quantity || 0) - (product.inventory?.reserved || 0);
    const inStock = maxStock > 0;

    const handleAddToCart = () => {
        addItem(product, quantity);
        // AddToCartButton handles its own loading animation,
        // and store handles opening drawer.
    };

    return (
        <div className="space-y-4 border-t pt-6">
            {inStock && (
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Quantity:</span>
                    <QuantitySelector
                        value={quantity}
                        onChange={setQuantity}
                        max={maxStock}
                    />
                </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                    <AddToCartButton
                        quantity={quantity}
                        availableStock={maxStock}
                        disabled={!inStock}
                        onAdd={handleAddToCart}
                    />
                </div>
                <div className="flex-1">
                    <button
                        className="inline-flex h-12 w-full items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        onClick={() => console.log('Wishlist clicked:', product.id)}
                    >
                        Add to Wishlist
                    </button>
                </div>
            </div>
        </div>
    );
}
