'use client';

import { useEffect } from 'react';

/**
 * Custom hook to lock body scroll when a modal/drawer is open
 * Prevents layout shift by compensating for scrollbar width
 */
export function useLockBodyScroll(locked: boolean) {
    useEffect(() => {
        if (!locked) return;

        const originalOverflow = document.body.style.overflow;
        const originalPaddingRight = document.body.style.paddingRight;

        // Calculate scrollbar width to prevent layout shift
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;

        return () => {
            document.body.style.overflow = originalOverflow;
            document.body.style.paddingRight = originalPaddingRight;
        };
    }, [locked]);
}
