'use client';

import { useEffect, useRef, useState } from 'react';
import { shouldReduceMotion } from '@/lib/motion-config';

interface ScrollFrameAnimationProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    delay?: number;
}

export function ScrollFrameAnimation({
    children,
    className = '',
    duration = 0.6,
    delay = 0,
}: ScrollFrameAnimationProps) {
    const elementRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const prefersReducedMotion = shouldReduceMotion();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry && entry.isIntersecting) {
                    setIsVisible(true);
                    if (elementRef.current) {
                        observer.unobserve(elementRef.current);
                    }
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px',
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, []);

    const animationStyle: React.CSSProperties = prefersReducedMotion
        ? {}
        : {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
        };

    return (
        <div ref={elementRef} style={animationStyle} className={className}>
            {children}
        </div>
    );
}
