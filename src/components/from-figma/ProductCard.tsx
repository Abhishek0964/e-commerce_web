import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    image: string;
    category?: string;
    rating?: number;
    inStock?: boolean;
    onAddToCart?: () => void;
    onAddToWishlist?: () => void;
}

/**
 * Enhanced ProductCard component with Figma-inspired design
 * Features: Hover animations, quick actions, optimized images, accessibility
 */
export function ProductCard({
    id,
    name,
    price,
    comparePrice,
    image,
    category,
    rating = 0,
    inStock = true,
    onAddToCart,
    onAddToWishlist,
}: ProductCardProps) {
    const [isWishlisted, setIsWishlisted] = useState(false);
    const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;

    const handleWishlist = () => {
        setIsWishlisted(!isWishlisted);
        onAddToWishlist?.();
    };

    return (
        <motion.div
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            {/* Image Container */}
            <Link href={`/products/${id}`} className="relative aspect-square overflow-hidden">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {discount > 0 && (
                        <span className="rounded-full bg-red-500 px-2.5 py-1 text-xs font-semibold text-white">
                            -{discount}%
                        </span>
                    )}
                    {!inStock && (
                        <span className="rounded-full bg-gray-900 px-2.5 py-1 text-xs font-semibold text-white">
                            Out of Stock
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <motion.div
                    className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                >
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleWishlist();
                        }}
                        className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
                        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                    >
                        <Heart
                            className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
                        />
                    </button>
                    <Link
                        href={`/products/${id}`}
                        className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
                        aria-label="Quick view"
                    >
                        <Eye className="h-5 w-5 text-gray-700" />
                    </Link>
                </motion.div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-1 flex-col p-4">
                {category && (
                    <span className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {category}
                    </span>
                )}

                <Link href={`/products/${id}`}>
                    <h3 className="mb-2 line-clamp-2 text-base font-semibold text-foreground hover:text-primary">
                        {name}
                    </h3>
                </Link>

                {/* Rating */}
                {rating > 0 && (
                    <div className="mb-2 flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <svg
                                key={i}
                                className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                                viewBox="0 0 20 20"
                            >
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                            </svg>
                        ))}
                        <span className="ml-1 text-xs text-muted-foreground">({rating}.0)</span>
                    </div>
                )}

                {/* Price */}
                <div className="mt-auto flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">₹{price.toLocaleString()}</span>
                    {comparePrice && (
                        <span className="text-sm text-muted-foreground line-through">
                            ₹{comparePrice.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={onAddToCart}
                    disabled={!inStock}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ShoppingCart className="h-4 w-4" />
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </motion.div>
    );
}
