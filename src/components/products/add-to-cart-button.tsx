'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { DURATION } from '@/lib/animations';

interface AddToCartButtonProps {
    quantity: number;
    availableStock: number;
    disabled?: boolean;
    onAdd?: () => void;
}

type ButtonState = 'idle' | 'loading' | 'success';

export function AddToCartButton({ quantity, availableStock, disabled = false, onAdd }: AddToCartButtonProps) {
    const [state, setState] = useState<ButtonState>('idle');

    const isDisabled = disabled || availableStock === 0 || state === 'loading';

    const handleClick = async () => {
        if (isDisabled) return;

        // Log quantity for future integration
        console.log(`Adding ${quantity} items to cart`);

        // Use provided callback if available
        if (onAdd) {
            onAdd();
        }

        setState('loading');

        // Simulate API call (UI-only, no actual cart logic)
        await new Promise(resolve => setTimeout(resolve, 1000));

        setState('success');

        // Reset to idle after 2 seconds
        setTimeout(() => {
            setState('idle');
        }, 2000);
    };

    return (
        <motion.div
            animate={state === 'success' ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: DURATION.normal }}
        >
            <Button
                size="lg"
                className="w-full"
                onClick={handleClick}
                disabled={isDisabled}
                aria-live="polite"
                aria-busy={state === 'loading'}
            >
                {state === 'loading' && (
                    <>
                        <Spinner size="sm" />
                        <span>Adding to Cart...</span>
                    </>
                )}
                {state === 'success' && (
                    <>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: DURATION.fast }}
                        >
                            <Check className="h-5 w-5" aria-hidden="true" />
                        </motion.div>
                        <span>Added to Cart!</span>
                    </>
                )}
                {state === 'idle' && (
                    <span>{availableStock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                )}
            </Button>
        </motion.div>
    );
}
