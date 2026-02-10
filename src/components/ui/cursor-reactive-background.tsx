'use client';

import { useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface TrailPoint {
    x: number;
    y: number;
    alpha: number;
    radius: number;
}

export function CursorTrailBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const trailRef = useRef<TrailPoint[]>([]);
    const animFrame = useRef<number>(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springX = useSpring(mouseX, { damping: 20, stiffness: 150, mass: 0.5 });
    const springY = useSpring(mouseY, { damping: 20, stiffness: 150, mass: 0.5 });

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw trail
        const trail = trailRef.current;
        for (let i = trail.length - 1; i >= 0; i--) {
            const p = trail[i];
            if (!p) continue;
            p.alpha -= 0.012;
            p.radius += 0.3;

            if (p.alpha <= 0) {
                trail.splice(i, 1);
                continue;
            }

            // Amazon orange glow trail
            const gradient = ctx.createRadialGradient(
                p.x, p.y, 0,
                p.x, p.y, p.radius
            );
            gradient.addColorStop(0, `rgba(255, 153, 0, ${p.alpha * 0.3})`);
            gradient.addColorStop(0.5, `rgba(255, 153, 0, ${p.alpha * 0.1})`);
            gradient.addColorStop(1, 'rgba(255, 153, 0, 0)');

            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw main cursor glow
        const cx = springX.get();
        const cy = springY.get();

        if (cx > 0 && cy > 0) {
            const mainGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 180);
            mainGlow.addColorStop(0, 'rgba(255, 153, 0, 0.08)');
            mainGlow.addColorStop(0.4, 'rgba(0, 113, 133, 0.04)');
            mainGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.beginPath();
            ctx.fillStyle = mainGlow;
            ctx.arc(cx, cy, 180, 0, Math.PI * 2);
            ctx.fill();
        }

        animFrame.current = requestAnimationFrame(draw);
    }, [springX, springY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const handleMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);

            // Add trail point
            trailRef.current.push({
                x: e.clientX,
                y: e.clientY,
                alpha: 0.6,
                radius: 8,
            });

            // Limit trail length
            if (trailRef.current.length > 40) {
                trailRef.current.shift();
            }
        };

        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouse);
        animFrame.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouse);
            cancelAnimationFrame(animFrame.current);
        };
    }, [draw, mouseX, mouseY]);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="pointer-events-none fixed inset-0 z-0"
                style={{ opacity: 0.7 }}
            />
            {/* Ambient floating orbs */}
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
                <motion.div
                    className="absolute h-[300px] w-[300px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,153,0,0.06) 0%, transparent 70%)',
                        top: '20%',
                        right: '10%',
                    }}
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
                <motion.div
                    className="absolute h-[250px] w-[250px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,113,133,0.05) 0%, transparent 70%)',
                        bottom: '15%',
                        left: '5%',
                    }}
                    animate={{
                        y: [0, 15, 0],
                        scale: [1, 1.05, 1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </div>
        </>
    );
}
