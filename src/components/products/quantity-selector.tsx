'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';
import { DURATION } from '@/lib/animations';

interface QuantitySelectorProps {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

function QuantitySelector({
    value,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
}: QuantitySelectorProps) {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min && newValue <= max) {
            onChange(newValue);
        }
    };

    return (
        <div className="inline-flex items-center gap-2 rounded-md border">
            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: DURATION.fast }}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleDecrement}
                    disabled={disabled || value <= min}
                    aria-label="Decrease quantity"
                    className="h-10 w-10 rounded-r-none"
                >
                    <Minus className="h-4 w-4" />
                </Button>
            </motion.div>

            <input
                type="number"
                value={value}
                onChange={handleInputChange}
                disabled={disabled}
                min={min}
                max={max}
                className="w-12 border-0 bg-transparent text-center text-sm font-medium focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
            />

            <motion.div whileTap={{ scale: 0.95 }} transition={{ duration: DURATION.fast }}>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleIncrement}
                    disabled={disabled || value >= max}
                    aria-label="Increase quantity"
                    className="h-10 w-10 rounded-l-none"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </motion.div>
        </div>
    );
}

export { QuantitySelector };
