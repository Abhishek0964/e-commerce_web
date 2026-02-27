'use client';

import { useCallback } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ProductFiltersState {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'rating' | 'newest' | 'popular';
}

interface ProductFiltersProps {
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  isLoading?: boolean;
}

const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price', label: 'Price: Low to High' },
  { value: 'rating', label: 'Highest Rated' },
];

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'audio', label: 'Audio' },
  { value: 'charging', label: 'Charging' },
];

const PRICE_RANGES = [
  { value: '', label: 'All Prices' },
  { value: '0-50', label: 'Under $50' },
  { value: '50-100', label: '$50 - $100' },
  { value: '100-250', label: '$100 - $250' },
  { value: '250+', label: 'Over $250' },
];

export function ProductFilters({
  filters,
  onFiltersChange,
  isLoading = false,
}: ProductFiltersProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFiltersChange({
        ...filters,
        search: e.target.value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({
        ...filters,
        category: e.target.value,
      });
    },
    [filters, onFiltersChange]
  );

  const handleSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFiltersChange({
        ...filters,
        sortBy: e.target.value as ProductFiltersState['sortBy'],
      });
    },
    [filters, onFiltersChange]
  );

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      if (value === '') {
        onFiltersChange({
          ...filters,
          minPrice: undefined,
          maxPrice: undefined,
        });
      } else if (value === '0-50') {
        onFiltersChange({ ...filters, minPrice: 0, maxPrice: 50 });
      } else if (value === '50-100') {
        onFiltersChange({ ...filters, minPrice: 50, maxPrice: 100 });
      } else if (value === '100-250') {
        onFiltersChange({ ...filters, minPrice: 100, maxPrice: 250 });
      } else if (value === '250+') {
        onFiltersChange({ ...filters, minPrice: 250, maxPrice: undefined });
      }
    },
    [filters, onFiltersChange]
  );

  const handleClearFilters = useCallback(() => {
    onFiltersChange({});
  }, [onFiltersChange]);

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined;

  return (
    <aside className="space-y-6">
      <div className="surface-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Filter className="h-5 w-5" />
            Filters
          </h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              disabled={isLoading}
              className="h-8"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search products..."
              value={filters.search || ''}
              onChange={handleSearchChange}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-sm font-medium text-foreground block mb-2">
              Category
            </label>
            <select
              id="category"
              value={filters.category || ''}
              onChange={handleCategoryChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label htmlFor="price" className="text-sm font-medium text-foreground block mb-2">
              Price Range
            </label>
            <select
              id="price"
              onChange={handlePriceChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {PRICE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sort" className="text-sm font-medium text-foreground block mb-2">
              Sort By
            </label>
            <select
              id="sort"
              value={filters.sortBy || ''}
              onChange={handleSortChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Default</option>
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </aside>
  );
}
