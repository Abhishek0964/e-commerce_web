'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    price: number;
    imageUrl?: string;
    categoryName?: string;
}

export function SearchBar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const debouncedQuery = useDebounce(query, 300);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Search API call
    const searchProducts = useCallback(async (searchQuery: string) => {
        if (!searchQuery.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&per_page=5`);
            const data = await response.json();

            if (data.data?.results) {
                setResults(data.data.results.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    slug: item.slug,
                    price: item.price,
                    imageUrl: item.image_url,
                    categoryName: item.category,
                })));
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Debounced search
    useEffect(() => {
        if (debouncedQuery) {
            searchProducts(debouncedQuery);
            setIsOpen(true);
        } else {
            setResults([]);
            setIsOpen(false);
        }
    }, [debouncedQuery, searchProducts]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen || results.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0) {
                    handleResultClick(results[selectedIndex]);
                } else {
                    handleSearch();
                }
                break;
            case 'Escape':
                setIsOpen(false);
                inputRef.current?.blur();
                break;
        }
    };

    const handleResultClick = (result: SearchResult) => {
        router.push(`/products/${result.slug}`);
        setIsOpen(false);
        setQuery('');
    };

    const handleSearch = () => {
        if (query.trim()) {
            router.push(`/products?q=${encodeURIComponent(query)}`);
            setIsOpen(false);
        }
    };

    const clearSearch = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-2xl">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && setIsOpen(true)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-10 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {query && (
                    <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label="Clear search"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <X className="h-5 w-5" />
                        )}
                    </button>
                )}
            </div>

            {/* Autocomplete Dropdown */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    {results.map((result, index) => (
                        <button
                            key={result.id}
                            onClick={() => handleResultClick(result)}
                            className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-muted transition ${index === selectedIndex ? 'bg-muted' : ''
                                }`}
                        >
                            {result.imageUrl && (
                                <img
                                    src={result.imageUrl}
                                    alt={result.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                            )}
                            <div className="flex-1 text-left">
                                <p className="font-medium text-sm">{result.name}</p>
                                {result.categoryName && (
                                    <p className="text-xs text-muted-foreground">{result.categoryName}</p>
                                )}
                            </div>
                            <p className="font-semibold">₹{result.price}</p>
                        </button>
                    ))}

                    {/* See All Results Link */}
                    <button
                        onClick={handleSearch}
                        className="w-full px-4 py-3 text-sm text-primary hover:bg-muted border-t transition"
                    >
                        See all results for &quot;{query}&quot; →
                    </button>
                </div>
            )}

            {/* Empty State */}
            {isOpen && !isLoading && query && results.length === 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg p-4">
                    <p className="text-sm text-muted-foreground text-center">
                        No products found for &quot;{query}&quot;
                    </p>
                </div>
            )}
        </div>
    );
}
