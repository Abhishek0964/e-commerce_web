import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
    variants: {
        variant: {
            text: 'h-4',
            heading: 'h-8',
            image: 'aspect-square',
            button: 'h-10',
            card: 'h-48',
            circle: 'rounded-full aspect-square',
        },
    },
    defaultVariants: {
        variant: 'text',
    },
});

export interface SkeletonProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
    width?: string;
}

function Skeleton({ className, variant, width, style, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(skeletonVariants({ variant }), className)}
            style={{ width, ...style }}
            role="status"
            aria-label="Loading..."
            {...props}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
}

export { Skeleton, skeletonVariants };
