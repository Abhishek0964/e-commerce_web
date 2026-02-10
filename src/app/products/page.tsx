'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductGrid } from '@/components/products/ProductGrid';
import { SearchBar } from '@/components/search/SearchBar';
import { Loader2, SlidersHorizontal } from 'lucide-react';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category?: string;
}

interface FilterState {
    category: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('min_price') || '',
        maxPrice: searchParams.get('max_price') || '',
        sortBy: searchParams.get('sort') || 'newest',
    });

    useEffect(() => {
        fetchProducts();
    }, [searchParams]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const query = searchParams.get('q') || '';
            const params = new URLSearchParams({
                ...(query && { q: query }),
                ...(filters.category && { category: filters.category }),
                ...(filters.minPrice && { min_price: filters.minPrice }),
                ...(filters.maxPrice && { max_price: filters.maxPrice }),
                sort: filters.sortBy,
            });

            const response = await fetch(`/api/search?${params}`);
            const data = await response.json();

            if (data.data?.results) {
                setProducts(
                    data.data.results.map((item: any) => ({
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        price: item.price,
                        images: item.images || [],
                        category: item.category,
                    }))
                );
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (key: keyof FilterState, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
            else params.delete(key);
        });
        window.history.pushState({}, '', `?${params.toString()}`);
        fetchProducts();
    };

    const clearFilters = () => {
        setFilters({
            category: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'newest',
        });
        window.history.pushState({}, '', '/products');
        fetchProducts();
    };

    const query = searchParams.get('q');

    return (
        <div className="min-h-screen bg-background">
            {/* Header Section */}
            <div className="border-b bg-white">
                <div className="container mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold mb-4">
                        {query ? `Search Results for "${query}"` : 'All Products'}
                    </h1>
                    <SearchBar />
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar Filters - Desktop */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-4 space-y-6">
                            <h2 className="text-lg font-semibold">Filters</h2>

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="">All Categories</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Home">Home</option>
                                    <option value="Sports">Sports</option>
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Price Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Sort By</label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={applyFilters}
                                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="w-full border py-2 rounded-lg hover:bg-muted transition"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Toggle */}
                        <div className="lg:hidden mb-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 border px-4 py-2 rounded-lg w-full justify-center hover:bg-muted transition"
                            >
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters & Sort
                            </button>
                        </div>

                        {/* Mobile Filters Dropdown */}
                        {showFilters && (
                            <div className="lg:hidden mb-6 p-4 border rounded-lg space-y-4 bg-white">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Home">Home</option>
                                        <option value="Sports">Sports</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Price Range</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Sort By</label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="name_asc">Name: A to Z</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={applyFilters}
                                        className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition"
                                    >
                                        Apply
                                    </button>
                                    <button
                                        onClick={clearFilters}
                                        className="flex-1 border py-2 rounded-lg hover:bg-muted transition"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Results Count */}
                        {!isLoading && (
                            <p className="text-sm text-muted-foreground mb-4">
                                {products.length} {products.length === 1 ? 'product' : 'products'} found
                            </p>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && products.length === 0 && (
                            <div className="text-center py-20">
                                <p className="text-xl font-semibold mb-2">No products found</p>
                                <p className="text-muted-foreground mb-4">
                                    Try adjusting your search or filters
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="text-primary hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Product Grid */}
                        {!isLoading && products.length > 0 && <ProductGrid products={products} />}
                    </div>
                </div>
            </div>
        </div>
    );
}
