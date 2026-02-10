'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';

export function SearchBox() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams?.get('q') || '';

    const [query, setQuery] = React.useState(initialQuery);
    const debouncedQuery = useDebounce(query, 300);

    // Sync URL with debounced query
    React.useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString() || '');

        if (debouncedQuery) {
            params.set('q', debouncedQuery);
        } else {
            params.delete('q');
        }

        // Reset page to 1 on new search
        if (debouncedQuery !== initialQuery) {
            params.set('page', '1');
        }

        router.push(`/products?${params.toString()}`, { scroll: false });
    }, [debouncedQuery, router, searchParams, initialQuery]);

    const handleClear = () => {
        setQuery('');
        const params = new URLSearchParams(searchParams?.toString() || '');
        params.delete('q');
        params.set('page', '1');
        router.push(`/products?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
                type="search"
                placeholder="Search products..."
                className="pl-9 pr-10"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
                    onClick={handleClear}
                    aria-label="Clear search"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
