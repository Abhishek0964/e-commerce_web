'use client';

import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { DURATION, EASING, fadeIn } from '@/lib/animations';

interface PriceDisplayProps {
    price: number;
    compareAtPrice?: number | null;
    className?: string;
    showDiscount?: boolean;
    size?: 'default' | 'large';
}

function PriceDisplay({
    price,
    compareAtPrice,
    className,
    showDiscount = true,
    size = 'default'
}: PriceDisplayProps) {
    const hasDiscount = compareAtPrice && compareAtPrice > price;
    const discountPercentage = hasDiscount
        ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
        : 0;

    const priceSize = size === 'large' ? 'text-4xl' : 'text-2xl';
    const comparePriceSize = size === 'large' ? 'text-xl' : 'text-lg';

    return (
        <div className={className}>
            <div className="flex items-baseline gap-2 flex-wrap">
                <span className={`font-bold ${priceSize}`}>
                    ₹{price.toLocaleString('en-IN')}
                </span>
                {hasDiscount && (
                    <>
                        <span className={`text-muted-foreground line-through ${comparePriceSize}`}>
                            ₹{compareAtPrice.toLocaleString('en-IN')}
                        </span>
                        {showDiscount && discountPercentage > 0 && (
                            <motion.div
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
                            >
                                <Badge variant="success" className="text-xs">
                                    {discountPercentage}% OFF
                                </Badge>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export { PriceDisplay };
