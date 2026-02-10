'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MobileNavDrawer } from './mobile-nav-drawer';
import { CartDrawer } from '@/components/cart/cart-drawer';
import { useCartStore } from '@/store/cart';
import { useScroll } from '@/hooks/use-scroll';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { isScrolled } = useScroll(10);
    const { user, signOut } = useAuth();
    const router = useRouter();

    const toggleDrawer = useCartStore((state) => state.toggleDrawer);
    const items = useCartStore((state) => state.items);

    // Calculate real cart count
    // Hydration safe: defaulted to 0 initially if needed, but zustand/persist usually handles it.
    // To be perfectly safe against hydration mismatch, we can wait for mount.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const cartCount = mounted ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    const handleSignOut = async () => {
        await signOut();
        router.push('/login');
    };

    return (
        <>
            <header
                className={cn(
                    'sticky top-0 z-50 w-full border-b transition-all duration-300',
                    // Scroll-reactive styles (no height change, zero CLS)
                    isScrolled
                        ? 'bg-background/95 shadow-sm backdrop-blur-md'
                        : 'bg-background/80 backdrop-blur-sm'
                )}
                style={{
                    // Preserve height to prevent CLS
                    height: '4rem', // 64px (h-16)
                }}
            >
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center space-x-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                    >
                        <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                        <span className="text-xl font-bold">ShopHub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden items-center space-x-6 md:flex" aria-label="Main navigation">
                        <Link
                            href="/"
                            className="text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
                        >
                            Home
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm px-1 py-0.5"
                        >
                            Products
                        </Link>

                        {/* Cart Toggle */}
                        <button
                            onClick={toggleDrawer}
                            className="relative text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm p-2"
                            aria-label={`Shopping cart with ${cartCount} items`}
                        >
                            <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                            {/* Cart Badge */}
                            {cartCount > 0 && (
                                <span
                                    className={cn(
                                        'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground',
                                        'motion-safe:animate-[pulse_2s_ease-in-out_infinite]'
                                    )}
                                    aria-hidden="true"
                                >
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Auth Menu */}
                        {mounted ? (
                            user ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                                            aria-label="User profile"
                                        >
                                            <User className="h-5 w-5" aria-hidden="true" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href="/profile">Profile</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/orders">Orders</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                                            Log out
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button asChild size="sm" variant="default">
                                    <Link href="/login">Login</Link>
                                </Button>
                            )
                        ) : (
                            // Loading/Skeleton state for auth to match height
                            <div className="h-9 w-16" />
                        )}
                    </nav>

                    {/* Mobile Menu Button - Also needs to toggle cart via drawer? 
                        Maybe keep cart accessible? 
                        Actually, let's add a mobile cart icon separate from menu 
                    */}
                    <div className="flex items-center gap-2 md:hidden">
                        <button
                            onClick={toggleDrawer}
                            className="relative p-2"
                            aria-label={`Shopping cart with ${cartCount} items`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open navigation menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer */}
            <MobileNavDrawer
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
            />

            {/* Global Cart Drawer */}
            <CartDrawer />
        </>
    );
}
