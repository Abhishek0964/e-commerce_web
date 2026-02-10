import { motion } from 'framer-motion';
import { ProductCard } from './ProductCard';

interface Product {
    id: string;
    name: string;
    price: number;
    comparePrice?: number;
    image: string;
    category?: string;
    rating?: number;
    inStock?: boolean;
}

interface ProductGridProps {
    products: Product[];
    columns?: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
    onAddToCart?: (productId: string) => void;
    onAddToWishlist?: (productId: string) => void;
}

/**
 * Responsive ProductGrid with customizable columns and stagger animations
 */
export function ProductGrid({
    products,
    columns = { mobile: 1, tablet: 2, desktop: 4 },
    onAddToCart,
    onAddToWishlist,
}: ProductGridProps) {
    const gridClass = `grid gap-6 grid-cols-${columns.mobile} sm:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop}`;

    return (
        <div className={gridClass}>
            {products.map((product, index) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                    <ProductCard
                        {...product}
                        onAddToCart={() => onAddToCart?.(product.id)}
                        onAddToWishlist={() => onAddToWishlist?.(product.id)}
                    />
                </motion.div>
            ))}
        </div>
    );
}
