'use client';

import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CursorReactiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for cursor position
    const springConfig = { damping: 25, stiffness: 100 };
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Gradient animation
        let frame = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Create radial gradient following cursor
            const gradient = ctx.createRadialGradient(
                smoothX.get(),
                smoothY.get(),
                0,
                smoothX.get(),
                smoothY.get(),
                Math.max(canvas.width, canvas.height) * 0.6
            );

            // Professional blue-green gradient with subtle animation
            const hue = (frame * 0.1) % 360;
            gradient.addColorStop(0, `hsla(${hue + 200}, 70%, 60%, 0.15)`); // Blue center
            gradient.addColorStop(0.5, `hsla(${hue + 160}, 60%, 50%, 0.08)`); // Green-blue mid
            gradient.addColorStop(1, 'hsla(220, 20%, 90%, 0)'); // Transparent edge

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            frame++;
            requestAnimationFrame(animate);
        };

        const animationId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, [smoothX, smoothY]);

    return (
        <>
            {/* Canvas for cursor-reactive gradient */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-0"
                style={{ mixBlendMode: 'normal' }}
            />

            {/* Animated gradient orbs as fallback/enhancement */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-blue-400/10 to-emerald-400/10 blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.5, 0.3, 0.5],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </>
    );
}
