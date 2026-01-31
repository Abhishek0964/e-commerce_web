import { Skeleton } from '../ui/skeleton';
import { Card } from '../ui/card';

function ProductCardSkeleton() {
    return (
        <Card className="overflow-hidden">
            <Skeleton variant="image" className="w-full" />
            <div className="space-y-3 p-4">
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2" />
                <div className="flex items-center justify-between">
                    <Skeleton variant="text" className="w-20" />
                    <Skeleton variant="button" className="w-16" />
                </div>
                <Skeleton variant="button" className="w-full" />
            </div>
        </Card>
    );
}

export { ProductCardSkeleton };
