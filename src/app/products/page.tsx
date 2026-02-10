import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProductGrid } from '@/components/products/product-grid';
import { ProductGridSkeleton } from '@/components/skeletons/product-grid-skeleton';
import { FiltersPanel } from '@/components/products/filters/filters-panel';
import { MobileFiltersDrawer } from '@/components/products/filters/mobile-filters-drawer';
import { SearchBox } from '@/components/products/search-box';
import { SortSelect } from '@/components/products/sort-select';
import { Pagination } from '@/components/ui/pagination';
import { getProducts, getCategories } from '@/lib/products';

export const metadata: Metadata = {
    title: 'All Products - ShopHub',
    description: 'Browse our collection of premium electronics, fashion, and accessories.',
};

interface ProductsPageProps {
    searchParams: Promise<{
        q?: string;
        category?: string;
        min_price?: string;
        max_price?: string;
        is_featured?: string;
        sort?: 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
        page?: string;
    }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
    const params = await searchParams;
    const currentPage = parseInt(params.page || '1', 10);
    const searchQuery = params.q || '';
    const categoryId = params.category; // FiltersPanel uses ID now

    // Prepare filters
    const filters = {
        search: searchQuery,
        category: categoryId,
        min_price: params.min_price ? parseInt(params.min_price) : undefined,
        max_price: params.max_price ? parseInt(params.max_price) : undefined,
        is_featured: params.is_featured === 'true' ? true : undefined,
        sort: params.sort,
    };

    const pagination = {
        page: currentPage,
        limit: 12,
    };

    // Parallel fetch
    const [categories, result] = await Promise.all([
        getCategories(),
        getProducts(filters, pagination),
    ]);

    const activeCategory = categoryId ? categories.find(c => c.id === categoryId) : null;

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Sticky Sub-Header for Search & Mobile Controls */}
            <div className="sticky top-16 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container px-4 py-4 md:py-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <SearchBox />
                        <div className="flex items-center gap-2 md:hidden">
                            <MobileFiltersDrawer categories={categories} />
                            <div className="flex-1"></div>
                            <SortSelect />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container px-4 py-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start">

                    {/* Desktop Sidebar Filters */}
                    <aside className="hidden w-64 shrink-0 lg:block lg:sticky lg:top-32">
                        <FiltersPanel categories={categories} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        {/* Desktop Header */}
                        <div className="mb-6 hidden items-center justify-between lg:flex">
                            <h1 className="text-2xl font-bold">
                                {activeCategory ? activeCategory.name : (searchQuery ? `Results for "${searchQuery}"` : 'All Products')}
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({result.total})
                                </span>
                            </h1>
                            <SortSelect />
                        </div>

                        {/* Mobile Header (Simplified) */}
                        <div className="mb-6 lg:hidden">
                            <h1 className="text-xl font-bold">
                                {activeCategory ? activeCategory.name : (searchQuery ? `Results for "${searchQuery}"` : 'All Products')}
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({result.total})
                                </span>
                            </h1>
                        </div>

                        {/* Product Grid */}
                        <Suspense fallback={<ProductGridSkeleton />}>
                            <ProductGrid products={result.products} />
                        </Suspense>

                        {/* Pagination */}
                        <div className="mt-12">
                            <Pagination totalPages={result.totalPages} />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
