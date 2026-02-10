'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/ui/empty-state';
import { Heart, Trash2, Loader2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WishlistItem {
    id: string;
    product_id: string;
    product_name: string;
    product_slug: string;
    product_price: number;
    product_image: string | null;
    product_is_active: boolean;
    category_name: string | null;
}

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await fetch('/api/wishlist');
            const data = await response.json();

            if (data.success) {
                setWishlistItems(data.data || []);
            }
        } catch (error) {
            console.error('Failed to fetch wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        setRemovingId(productId);
        try {
            const response = await fetch(`/api/wishlist?product_id=${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setWishlistItems((prev) => prev.filter((item) => item.product_id !== productId));
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setRemovingId(null);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <h1 className="mb-8 text-3xl font-bold">My Wishlist</h1>

                {wishlistItems.length === 0 ? (
                    <EmptyState
                        icon={<Heart className="h-16 w-16" />}
                        title="Your wishlist is empty"
                        description="Save your favorite products for later"
                        action={{
                            label: 'Browse Products',
                            href: '/products',
                        }}
                    />
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground mb-6">
                            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                        </p>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {wishlistItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
                                >
                                    {/* Product Image */}
                                    <Link href={`/products/${item.product_slug}`} className="block aspect-square relative bg-muted">
                                        {item.product_image ? (
                                            <Image
                                                src={item.product_image}
                                                alt={item.product_name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Heart className="h-12 w-12 text-muted-foreground" />
                                            </div>
                                        )}
                                    </Link>

                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeFromWishlist(item.product_id)}
                                        disabled={removingId === item.product_id}
                                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition disabled:opacity-50"
                                        aria-label="Remove from wishlist"
                                    >
                                        {removingId === item.product_id ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                        ) : (
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                        )}
                                    </button>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <Link href={`/products/${item.product_slug}`}>
                                            <h3 className="font-semibold text-sm mb-1 hover:text-primary transition line-clamp-2">
                                                {item.product_name}
                                            </h3>
                                        </Link>

                                        {item.category_name && (
                                            <p className="text-xs text-muted-foreground mb-2">{item.category_name}</p>
                                        )}

                                        <div className="flex items-center justify-between mt-3">
                                            <p className="font-bold text-lg">₹{item.product_price}</p>

                                            <Link href={`/products/${item.product_slug}`}>
                                                <Button size="sm" variant="outline" className="gap-2">
                                                    <ShoppingCart className="h-4 w-4" />
                                                    View
                                                </Button>
                                            </Link>
                                        </div>

                                        {!item.product_is_active && (
                                            <p className="text-xs text-red-600 mt-2">Out of stock</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
