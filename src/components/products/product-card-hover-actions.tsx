'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/button';
import { useCartStore } from '@/store/cart';
import { toast } from 'sonner';
import type { ProductWithDetails } from '@/types/product';

interface ProductCardHoverActionsProps {
    product: ProductWithDetails;
    inStock: boolean;
}

function ProductCardHoverActions({
    product,
    inStock,
}: ProductCardHoverActionsProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
    const openDrawer = useCartStore((state) => state.openDrawer);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', {
            description: product.name,
            duration: 2000,
        });
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!inStock) return;

        addItem(product);

        toast.success('Added to cart', {
            description: product.name,
            action: {
                label: 'View Cart',
                onClick: () => openDrawer(),
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2"
        >
            <Button
                size="sm"
                className="flex-1 gap-2"
                disabled={!inStock}
                onClick={handleAddToCart}
            >
                <ShoppingBag className="h-4 w-4" />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button
                size="icon"
                variant={isWishlisted ? 'default' : 'outline'}
                onClick={handleWishlistToggle}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                className="h-9 w-9"
            >
                <motion.div
                    animate={isWishlisted ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Heart
                        className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`}
                    />
                </motion.div>
            </Button>
        </motion.div>
    );
}

export { ProductCardHoverActions };
