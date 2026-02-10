'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../ui/button';

interface ProductCardHoverActionsProps {
    productId: string;
    productSlug: string;
    inStock: boolean;
}

function ProductCardHoverActions({
    productId: _productId,
    productSlug: _productSlug,
    inStock,
}: ProductCardHoverActionsProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsWishlisted(!isWishlisted);
        // TODO: Integrate with wishlist store/API
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
                className="flex-1"
                disabled={!inStock}
                onClick={(e) => {
                    e.preventDefault();
                    // TODO: Add to cart functionality
                }}
            >
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
