import { Search, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchHeaderProps {
    onSearch?: (query: string) => void;
    placeholder?: string;
}

/**
 * Enhanced search header with autocomplete support and smooth animations
 */
export function SearchHeader({ onSearch, placeholder = 'Search products...' }: SearchHeaderProps) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (value: string) => {
        setQuery(value);
        onSearch?.(value);
    };

    const clearSearch = () => {
        setQuery('');
        onSearch?.('');
        inputRef.current?.focus();
    };

    return (
        <div className="relative w-full max-w-2xl">
            <motion.div
                className={`relative flex items-center overflow-hidden rounded-full border-2 transition-colors ${isFocused ? 'border-primary' : 'border-border'
                    }`}
                animate={{ scale: isFocused ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
            >
                <Search className="ml-4 h-5 w-5 text-muted-foreground" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
                <AnimatePresence>
                    {query && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearSearch}
                            className="mr-2 rounded-full p-1.5 hover:bg-accent"
                            aria-label="Clear search"
                        >
                            <X className="h-4 w-4 text-muted-foreground" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
