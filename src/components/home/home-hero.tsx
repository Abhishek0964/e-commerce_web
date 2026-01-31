'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function HomeHero() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
            <div className="container mx-auto px-4 py-20 text-white md:py-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="mb-6 text-4xl font-bold  md:text-6xl lg:text-7xl"
                    >
                        Welcome to ShopHub
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-8 text-xl md:text-2xl lg:text-3xl"
                    >
                        Discover quality products at unbeatable prices
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                    >
                        <Link href="/products">
                            <Button
                                size="lg"
                                variant="secondary"
                                icon={<ArrowRight className="h-5 w-5" />}
                                iconPosition="right"
                                className="text-lg"
                            >
                                Shop Now
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            {/* Decorative gradient circles */}
            <div className="pointer-events-none absolute -left-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </section>
    );
}
