'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Category } from '@/types/product';

interface CategoryGridProps {
    categories: Category[];
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
        },
    },
};

export function CategoryGrid({ categories }: CategoryGridProps) {
    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5"
        >
            {categories.map((category) => (
                <motion.div key={category.id} variants={item}>
                    <Link
                        href={`/products?category=${category.slug}`}
                        className="group block overflow-hidden rounded-lg border bg-card transition-all duration-300 hover:shadow-lg"
                    >
                        <div className="relative aspect-square overflow-hidden bg-muted">
                            {category.image_url && (
                                <Image
                                    src={category.image_url}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <h3 className="font-semibold text-white transition-transform duration-300 group-hover:translate-y-[-2px]">
                                    {category.name}
                                </h3>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </motion.div>
    );
}
