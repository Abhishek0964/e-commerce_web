import type { Variants } from 'framer-motion';

/**
 * Animation duration constants (in seconds)
 */
export const DURATION = {
    fast: 0.15,
    normal: 0.3,
    slow: 0.5,
} as const;

/**
 * Easing functions
 */
export const EASING = {
    easeOut: [0, 0, 0.2, 1],
    easeIn: [0.4, 0, 1, 1],
    easeInOut: [0.4, 0, 0.2, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
} as const;

/**
 * Common animation variants
 */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
};

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
};

/**
 * Stagger configuration for list animations
 */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.normal },
    },
};

/**
 * Press animation for buttons
 */
export const pressAnimation = {
    scale: 0.98,
    transition: { duration: DURATION.fast },
};

/**
 * Hover animation for cards
 */
export const hoverLift = {
    y: -4,
    transition: { duration: DURATION.fast, ease: EASING.easeOut },
};

/**
 * Utility to check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Wrapper to disable animations for users who prefer reduced motion
 */
export function withReducedMotion<T extends Variants>(variants: T): T {
    if (prefersReducedMotion()) {
        return Object.keys(variants).reduce((acc, key) => {
            acc[key] = { opacity: 1 };
            return acc;
        }, {} as any);
    }
    return variants;
}

/**
 * Page transition variants
 */
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.normal, ease: EASING.easeOut },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: DURATION.fast },
    },
};
