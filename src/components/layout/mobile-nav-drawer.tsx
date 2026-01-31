'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, Home, ShoppingBag, ShoppingCart, User, Heart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLockBodyScroll } from '@/hooks/use-lock-body-scroll';
import { createFocusTrap } from '@/lib/accessibility';
import { DURATION, EASING } from '@/lib/animations';

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/products', label: 'Products', icon: ShoppingBag },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/wishlist', label: 'Wishlist', icon: Heart },
    { href: '/orders', label: 'Orders', icon: Package },
    { href: '/profile', label: 'Profile', icon: User },
];

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
    const drawerRef = useRef<HTMLDivElement>(null);

    // Lock body scroll when drawer is open
    useLockBodyScroll(isOpen);

    // Focus trap and ESC key handling
    useEffect(() => {
        if (!isOpen || !drawerRef.current) return;

        // Set up focus trap
        const cleanup = createFocusTrap(drawerRef.current);

        // ESC key handler
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);

        return () => {
            cleanup();
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: DURATION.normal }}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            duration: DURATION.normal,
                            ease: EASING.easeOut
                        }}
                        className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-background shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation menu"
                    >
                        {/* Header */}
                        <div className="flex h-16 items-center justify-between border-b px-4">
                            <span className="text-lg font-bold">Menu</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                aria-label="Close navigation menu"
                                className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex flex-col gap-1 p-4" aria-label="Main navigation">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={onClose}
                                        className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.98]"
                                        style={{
                                            minHeight: '44px', // Minimum touch target
                                        }}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                        <span className="line-clamp-2">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
