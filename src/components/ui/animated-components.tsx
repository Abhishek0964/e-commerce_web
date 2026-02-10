'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedPageProps {
    children: ReactNode;
}

export function AnimatedPage({ children }: AnimatedPageProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth feel
            }}
        >
            {children}
        </motion.div>
    );
}

// Stagger animation for lists
export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
        >
            {children}
        </motion.div>
    );
}

// Scale hover effect
export function ScaleOnHover({ children, className = '', scale = 1.05 }: { children: ReactNode; className?: string; scale?: number }) {
    return (
        <motion.div
            className={className}
            whileHover={{ scale }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            {children}
        </motion.div>
    );
}

// Fade in when in view
export function FadeInView({ children, className = '' }: { children: ReactNode; className?: string }) {
    return (
        <motion.div
            className={className}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
        >
            {children}
        </motion.div>
    );
}
