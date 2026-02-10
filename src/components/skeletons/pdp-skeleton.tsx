import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                {/* Gallery Skeleton */}
                <div className="flex flex-col-reverse gap-4 md:flex-row">
                    <div className="flex gap-4 overflow-x-auto md:flex-col">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-20 w-20 shrink-0 rounded-md" />
                        ))}
                    </div>
                    <Skeleton className="aspect-square flex-1 rounded-md" />
                </div>

                {/* Info Skeleton */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20 rounded-full" />
                        <Skeleton className="h-10 w-3/4" />
                    </div>

                    <div className="space-y-2">
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-6 w-24" />
                    </div>

                    <div className="border-t pt-6 space-y-4">
                        <div className="flex gap-4">
                            <Skeleton className="h-10 w-32" />
                        </div>
                        <div className="flex gap-4">
                            <Skeleton className="h-12 flex-1" />
                            <Skeleton className="h-12 flex-1" />
                        </div>
                    </div>

                    <div className="space-y-4 pt-6">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
