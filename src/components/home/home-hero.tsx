'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';

// Floating product card for parallax layers
function FloatingCard({
    emoji,
    label,
    price,
    className,
    delay,
}: {
    emoji: string;
    label: string;
    price: string;
    className?: string;
    delay: number;
}) {
    return (
        <motion.div
            className={`absolute rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur-lg shadow-xl ${className}`}
            initial={{ opacity: 0, y: 50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.8, delay, type: 'spring', stiffness: 100 }}
        >
            <div className="text-3xl mb-1">{emoji}</div>
            <p className="text-xs font-semibold text-white/90">{label}</p>
            <p className="text-xs text-primary font-bold">{price}</p>
        </motion.div>
    );
}

export function HomeHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true });

    const { scrollY } = useScroll();
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { damping: 30, stiffness: 100 });
    const smoothMouseY = useSpring(mouseY, { damping: 30, stiffness: 100 });

    // Parallax layers at different speeds
    const layer1Y = useTransform(scrollY, [0, 500], [0, -60]);
    const layer2Y = useTransform(scrollY, [0, 500], [0, -120]);
    const layer3Y = useTransform(scrollY, [0, 500], [0, -180]);
    const bgY = useTransform(scrollY, [0, 500], [0, -30]);
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const textScale = useTransform(scrollY, [0, 300], [1, 0.9]);

    useEffect(() => {
        const handleMouse = (e: MouseEvent) => {
            const container = containerRef.current;
            if (!container) return;
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mouseX.set(x * 30);
            mouseY.set(y * 30);
        };

        window.addEventListener('mousemove', handleMouse);
        return () => window.removeEventListener('mousemove', handleMouse);
    }, [mouseX, mouseY]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-[85vh] overflow-hidden"
        >
            {/* Background with parallax */}
            <motion.div
                className="absolute inset-0"
                style={{ y: bgY }}
            >
                {/* Amazon dark gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-secondary-800 via-secondary-600 to-secondary-900" />

                {/* Grid pattern overlay */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />

                {/* Animated gradient orbs */}
                <motion.div
                    className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,153,0,0.25) 0%, transparent 60%)',
                        x: smoothMouseX,
                        y: smoothMouseY,
                    }}
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,113,133,0.2) 0%, transparent 60%)',
                    }}
                    animate={{
                        scale: [1, 1.15, 1],
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                />
            </motion.div>

            {/* 3D Parallax Floating Product Cards - Layer 1 (far) */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: layer1Y }}
            >
                <FloatingCard
                    emoji="🎧"
                    label="Headphones"
                    price="₹2,999"
                    className="top-[15%] left-[8%]"
                    delay={0.3}
                />
                <FloatingCard
                    emoji="📱"
                    label="Smartphones"
                    price="₹14,999"
                    className="bottom-[20%] right-[8%]"
                    delay={0.5}
                />
            </motion.div>

            {/* Layer 2 (mid) */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: layer2Y }}
            >
                <FloatingCard
                    emoji="👟"
                    label="Running Shoes"
                    price="₹3,499"
                    className="top-[35%] right-[12%]"
                    delay={0.7}
                />
                <FloatingCard
                    emoji="📚"
                    label="Bestsellers"
                    price="₹299"
                    className="bottom-[30%] left-[12%]"
                    delay={0.9}
                />
            </motion.div>

            {/* Layer 3 (near - fastest) */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ y: layer3Y }}
            >
                <FloatingCard
                    emoji="⌚"
                    label="Smartwatch"
                    price="₹5,999"
                    className="top-[10%] right-[25%]"
                    delay={1.1}
                />
                <FloatingCard
                    emoji="🍳"
                    label="Cookware"
                    price="₹1,299"
                    className="bottom-[15%] left-[25%]"
                    delay={1.3}
                />
            </motion.div>

            {/* Main Content - Center text */}
            <motion.div
                className="relative z-10 flex min-h-[85vh] items-center justify-center px-4"
                style={{ opacity: textOpacity, scale: textScale }}
            >
                <div className="text-center max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7 }}
                    >
                        {/* Trust badge */}
                        <motion.div
                            className="inline-flex items-center gap-2 mb-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md border border-white/10"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.3 }}
                        >
                            <Star className="h-4 w-4 text-star fill-star" />
                            <span>Trusted by 10,000+ happy customers</span>
                        </motion.div>
                    </motion.div>

                    <motion.h1
                        className="mb-6 text-5xl font-extrabold text-white md:text-7xl lg:text-8xl tracking-tight"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        Shop{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
                            Smarter
                        </span>
                        <br />
                        Live Better
                    </motion.h1>

                    <motion.p
                        className="mb-10 text-lg text-white/70 md:text-xl max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.4 }}
                    >
                        Premium products across Electronics, Fashion, Home & Kitchen.
                        Free shipping on orders above ₹999.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.6 }}
                    >
                        <Link href="/products">
                            <Button
                                size="lg"
                                className="bg-gradient-to-b from-primary-400 to-primary-600 text-secondary-900 font-bold text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
                            >
                                <ShoppingBag className="mr-2 h-5 w-5" />
                                Start Shopping
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/products?sort=newest">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 text-lg px-8 py-6"
                            >
                                New Arrivals
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/50 text-sm"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ delay: 1 }}
                    >
                        <div className="flex items-center gap-2">
                            <Truck className="h-5 w-5" />
                            <span>Free Shipping</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            <span>Secure Payments</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            <span>4.8★ Rating</span>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
