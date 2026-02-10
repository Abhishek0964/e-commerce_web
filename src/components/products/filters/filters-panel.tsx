'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox'; // Assuming exists
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/product';

interface FiltersPanelProps {
    categories: Category[];
    className?: string;
}

export function FiltersPanel({ categories, className }: FiltersPanelProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- State --
    // We initialize state from URL to properly reflect active filters on load
    const activeCategory = searchParams.get('category') || 'all';
    const minPrice = searchParams.get('min_price') || '';
    const maxPrice = searchParams.get('max_price') || '';
    const isFeatured = searchParams.get('is_featured') === 'true';

    // -- Handlers --

    const updateParam = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset page on filter change
        params.set('page', '1');

        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    const handleCategoryChange = (value: string) => {
        updateParam('category', value === 'all' ? null : value);
    };

    // Filter by Price (Debounced in a real app, strict update here for now)
    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        const key = type === 'min' ? 'min_price' : 'max_price';
        updateParam(key, value);
    };

    const handleFeaturedChange = (checked: boolean) => {
        updateParam('is_featured', checked ? 'true' : null);
    };

    const clearFilters = () => {
        router.push('/products', { scroll: false });
    };

    return (
        <aside className={cn("space-y-6", className)} aria-label="Product Filters">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Filters</h3>
                {(activeCategory !== 'all' || minPrice || maxPrice || isFeatured) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-8 px-2 text-xs text-muted-foreground hover:text-primary"
                    >
                        Reset
                    </Button>
                )}
            </div>

            <Separator />

            {/* Categories */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Category</h4>
                <RadioGroup value={activeCategory} onValueChange={handleCategoryChange}>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="cat-all" />
                        <Label htmlFor="cat-all" className="cursor-pointer">All Products</Label>
                    </div>
                    {categories.map((cat) => (
                        <div key={cat.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={cat.id} id={`cat-${cat.id}`} />
                            <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">{cat.name}</Label>
                        </div>
                    ))}
                </RadioGroup>
            </div>

            <Separator />

            {/* Price Range */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Price Range</h4>
                <div className="flex items-center gap-2">
                    <div className="grid gap-1">
                        <Label htmlFor="min-price" className="text-xs text-muted-foreground">Min</Label>
                        <input
                            type="number"
                            id="min-price"
                            placeholder="0"
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={minPrice}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                        />
                    </div>
                    <span className="text-muted-foreground pt-5">-</span>
                    <div className="grid gap-1">
                        <Label htmlFor="max-price" className="text-xs text-muted-foreground">Max</Label>
                        <input
                            type="number"
                            id="max-price"
                            placeholder="Max"
                            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={maxPrice}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Availability / Other */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm">Product Status</h4>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="featured"
                        checked={isFeatured}
                        onCheckedChange={handleFeaturedChange}
                    />
                    <Label htmlFor="featured" className="cursor-pointer font-normal">Featured Only</Label>
                </div>
            </div>
        </aside>
    );
}
