'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  }, [searchQuery]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Main header content */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="hidden sm:inline font-bold text-xl text-foreground">
              ShopHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Shop
            </Link>
            <Link href="/products?category=electronics" className="text-sm font-medium hover:text-primary transition-colors">
              Electronics
            </Link>
            <Link href="/products?category=accessories" className="text-sm font-medium hover:text-primary transition-colors">
              Accessories
            </Link>
          </nav>

          {/* Desktop Search - simplified for layout */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center gap-2 flex-1 mx-6">
            <div className="relative flex-1 max-w-sm">
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </form>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Search on mobile */}
            <button
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 hover:bg-secondary rounded-lg transition-colors relative group"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                0
              </span>
            </Link>

            {/* Auth button */}
            <Link href="/auth/signin">
              <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link
              href="/products"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/products?category=electronics"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Electronics
            </Link>
            <Link
              href="/products?category=accessories"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Accessories
            </Link>
            <Link
              href="/auth/signin"
              className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
