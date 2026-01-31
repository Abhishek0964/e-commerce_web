'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';
import { ProductCardHoverActions } from './product-card-hover-actions';
import type { ProductWithDetails, ProductImage } from '@/types/product';

interface ProductCardProps {
    product: ProductWithDetails;
}

function ProductCard({ product }: ProductCardProps) {
    const [isHovered, setIsHovered] = React.useState(false);
    const images = (product.images as unknown as ProductImage[]) || [];
    const mainImage = images[0];
    const inStock = (product.available_stock || 0) > 0;

    const discount = product.compare_at_price && product.compare_at_price > product.price
        ? Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
        : 0;

    return (
        <Link href={`/products/${product.slug}`}>
            <motion.div
                className="group relative overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
            >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                    {mainImage ? (
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="h-full w-full"
                        >
                            <Image
                                src={mainImage.url}
                                alt={mainImage.alt || product.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </motion.div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            No image
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-2">
                        {product.is_featured && (
                            <Badge variant="default">Featured</Badge>
                        )}
                        {discount > 0 && (
                            <Badge variant="success">{discount}% OFF</Badge>
                        )}
                        {!inStock && (
                            <Badge variant="destructive">Out of Stock</Badge>
                        )}
                    </div>

                    {/* Hover Actions */}
                    <AnimatePresence>
                        {isHovered && (
                            <ProductCardHoverActions
                                productId={product.id}
                                productSlug={product.slug}
                                inStock={inStock}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Product Info */}
                <div className="space-y-2 p-4">
                    {/* Category */}
                    {product.category && (
                        <p className="text-xs text-muted-foreground">
                            {product.category.name}
                        </p>
                    )}

                    {/* Product Name */}
                    <h3 className="line-clamp-2 font-semibold transition-colors group-hover:text-primary">
                        {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.compare_at_price && product.compare_at_price > product.price && (
                            <span className="text-sm text-muted-foreground line-through">
                                ₹{product.compare_at_price.toLocaleString('en-IN')}
                            </span>
                        )}
                    </div>

                    {/* Stock Status */}
                    {inStock && product.available_stock && product.available_stock <= 10 && (
                        <p className="text-xs text-yellow-600">
                            Only {product.available_stock} left
                        </p>
                    )}
                </div>
            </motion.div>
        </Link>
    );
}

export { ProductCard };
