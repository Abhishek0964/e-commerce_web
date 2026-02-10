'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
    images: Array<{
        id?: string;
        image_url: string;
        alt_text?: string;
        display_order?: number;
    }>;
    productName: string;
}

export function ImageCarousel({ images, productName }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const sortedImages = [...images].sort((a, b) =>
        (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedImages.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
    };

    const goToImage = (index: number) => {
        setCurrentIndex(index);
    };

    if (sortedImages.length === 0) {
        return (
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">No image available</p>
            </div>
        );
    }

    const currentImage = sortedImages[currentIndex];

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
                <Image
                    src={currentImage.image_url}
                    alt={currentImage.alt_text || `${productName} - Image ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    priority={currentIndex === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Navigation Arrows (only if multiple images) */}
                {sortedImages.length > 1 && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={goToPrevious}
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                            onClick={goToNext}
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </>
                )}

                {/* Image Counter */}
                {sortedImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                        {currentIndex + 1} / {sortedImages.length}
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {sortedImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {sortedImages.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => goToImage(index)}
                            className={`relative aspect-square overflow-hidden rounded-md border-2 transition ${index === currentIndex ? 'border-primary' : 'border-transparent hover:border-muted-foreground/50'
                                }`}
                            aria-label={`View image ${index + 1}`}
                        >
                            <Image
                                src={image.image_url}
                                alt={`${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="20vw"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
