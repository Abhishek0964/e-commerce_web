import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

interface StockBadgeProps {
    availableStock: number;
    lowStockThreshold?: number;
    className?: string;
}

function StockBadge({
    availableStock,
    lowStockThreshold = 10,
    className
}: StockBadgeProps) {
    if (availableStock === 0) {
        return (
            <Badge variant="destructive" className={className}>
                Out of Stock
            </Badge>
        );
    }

    if (availableStock <= lowStockThreshold) {
        return (
            <Badge
                variant="warning"
                className={cn(
                    'motion-safe:animate-pulse',
                    className
                )}
            >
                Only {availableStock} left
            </Badge>
        );
    }

    return (
        <Badge variant="success" className={className}>
            In Stock
        </Badge>
    );
}

export { StockBadge };
