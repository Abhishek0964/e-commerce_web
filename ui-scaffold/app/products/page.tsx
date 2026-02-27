'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/api';
import { Product, Category } from '@/lib/types';
import { ProductFilters, ProductFiltersState } from '@/components/products/product-filters';
import { ProductsGrid } from '@/components/products/products-grid';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

export const metadata: Metadata = {
  title: 'Shop All Products - ShopHub',
  description: 'Browse our full selection of electronics and accessories',
};

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState<ProductFiltersState>({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || undefined,
  });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('[ShopHub] Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts({
          query: filters.search,
          category: filters.category,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          sortBy: filters.sortBy,
          page: 1,
          limit: 12,
        });
        setProducts(data.products);
        setTotalCount(data.total);
      } catch (error) {
        console.error('[ShopHub] Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: ProductFiltersState) => {
    setFilters(newFilters);
  }, []);

  const handleAddToCart = (productId: string) => {
    console.log('[ShopHub] Add to cart:', productId);
    // Will be implemented in cart task
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Header */}
      <ScrollFrameAnimation className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Shop All Products
        </h1>
        <p className="text-lg text-muted-foreground">
          Discover {totalCount} premium products
        </p>
      </ScrollFrameAnimation>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar - hidden on mobile */}
        <div className="hidden lg:block">
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isLoading={isLoading}
          />
        </div>

        {/* Products grid */}
        <div className="lg:col-span-3">
          {/* Mobile filters placeholder */}
          <div className="lg:hidden mb-6">
            <details className="surface-elevated p-4">
              <summary className="cursor-pointer font-semibold text-foreground flex items-center gap-2">
                <span>🔽 Show Filters</span>
              </summary>
              <div className="mt-4">
                <ProductFilters
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  isLoading={isLoading}
                />
              </div>
            </details>
          </div>

          {/* Results info */}
          <div className="mb-6 text-sm text-muted-foreground">
            {!isLoading && (
              <p>
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
                {filters.search && ` for "${filters.search}"`}
              </p>
            )}
          </div>

          {/* Products */}
          <ProductsGrid
            products={products}
            isLoading={isLoading}
            isEmpty={!isLoading && products.length === 0}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-8">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
