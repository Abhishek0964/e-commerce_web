'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductImage } from '@/types/product';
import { cn } from '@/lib/utils';
import { DURATION, EASING } from '@/lib/animations';

interface ProductImageGalleryProps {
    images: ProductImage[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);

    // Ensure selectedIndex is valid
    const validImages = images.filter(img => img?.url);
    const selectedImage = validImages[selectedIndex] || validImages[0];

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                setSelectedIndex(prev => (prev > 0 ? prev - 1 : validImages.length - 1));
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                e.preventDefault();
                setSelectedIndex(prev => (prev < validImages.length - 1 ? prev + 1 : 0));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [validImages.length]);

    const handleThumbnailClick = useCallback((index: number) => {
        setSelectedIndex(index);
    }, []);

    if (validImages.length === 0) {
        return (
            <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted">
                <p className="text-muted-foreground">No images available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row">
            {/* Vertical Thumbnail Stack (Desktop - LEFT) */}
            {validImages.length > 1 && (
                <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:w-20 md:flex-col md:overflow-y-auto">
                    {validImages.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={cn(
                                'group relative aspect-square w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:w-full',
                                selectedIndex === index
                                    ? 'border-primary ring-2 ring-primary ring-offset-2'
                                    : 'border-border'
                            )}
                            aria-label={`View image ${index + 1}`}
                            aria-pressed={selectedIndex === index}
                            style={{
                                minHeight: '44px', // Touch target
                                minWidth: '44px',
                            }}
                        >
                            <Image
                                src={image.url}
                                alt={image.alt || `${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover transition-opacity group-hover:opacity-80"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Main Image */}
            <div className="order-1 flex-1 md:order-2">
                <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedIndex}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: DURATION.normal,
                                ease: EASING.easeOut,
                            }}
                            className="h-full w-full"
                        >
                            <Image
                                src={selectedImage?.url || ''}
                                alt={selectedImage?.alt || productName}
                                fill
                                className="object-cover"
                                priority={selectedIndex === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Image Counter */}
                {validImages.length > 1 && (
                    <div className="mt-2 text-center text-sm text-muted-foreground">
                        {selectedIndex + 1} / {validImages.length}
                    </div>
                )}
            </div>
        </div>
    );
}
