'use client';

import { useEffect, useState } from 'react';

export interface ScrollState {
    scrollY: number;
    scrollDirection: 'up' | 'down' | null;
    isScrolled: boolean;
}

/**
 * Custom hook to track scroll position and direction
 * @param threshold - Scroll distance in pixels to trigger isScrolled state
 */
export function useScroll(threshold: number = 10): ScrollState {
    const [scrollState, setScrollState] = useState<ScrollState>({
        scrollY: 0,
        scrollDirection: null,
        isScrolled: false,
    });

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateScrollState = () => {
            const scrollY = window.scrollY;
            const scrollDirection = scrollY > lastScrollY ? 'down' : scrollY < lastScrollY ? 'up' : null;
            const isScrolled = scrollY > threshold;

            setScrollState({
                scrollY,
                scrollDirection,
                isScrolled,
            });

            lastScrollY = scrollY;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateScrollState);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return scrollState;
}
