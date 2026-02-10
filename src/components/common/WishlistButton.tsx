'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface WishlistButtonProps {
    productId: string;
    initialInWishlist?: boolean;
    className?: string;
}

export function WishlistButton({ productId, initialInWishlist = false, className = '' }: WishlistButtonProps) {
    const { toast } = useToast();
    const [inWishlist, setInWishlist] = useState(initialInWishlist);
    const [loading, setLoading] = useState(false);

    const toggleWishlist = async () => {
        setLoading(true);

        try {
            if (inWishlist) {
                // Remove from wishlist
                // Note: We need the wishlist item ID, which we don't have here
                // For now, we'll use a DELETE with product_id filter
                const response = await fetch(`/api/wishlist?product_id=${productId}`, {
                    method: 'DELETE',
                });

                if (!response.ok) throw new Error('Failed to remove from wishlist');

                setInWishlist(false);
                toast({
                    title: 'Removed from wishlist',
                    description: 'Product removed from your wishlist',
                });
            } else {
                // Add to wishlist
                const response = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ product_id: productId }),
                });

                if (!response.ok) {
                    const error = await response.json();
                    if (response.status === 409) {
                        setInWishlist(true);
                        return;
                    }
                    throw new Error(error.error || 'Failed to add to wishlist');
                }

                setInWishlist(true);
                toast({
                    title: 'Added to wishlist',
                    description: 'Product saved to your wishlist',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleWishlist}
            disabled={loading}
            className={className}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-red-500 text-red-500' : 'text-muted-foreground hover:text-red-500'
                    }`}
            />
        </Button>
    );
}
