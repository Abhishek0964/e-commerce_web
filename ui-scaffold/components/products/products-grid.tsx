import { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

interface ProductsGridProps {
  products: Product[];
  isLoading?: boolean;
  isEmpty?: boolean;
  onAddToCart?: (productId: string) => void;
}

export function ProductsGrid({
  products,
  isLoading = false,
  isEmpty = false,
  onAddToCart,
}: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No products found
        </h3>
        <p className="text-muted-foreground text-center">
          Try adjusting your search or filter criteria to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ScrollFrameAnimation
          key={product.id}
          delay={index * 0.05}
          className="h-full"
        >
          <ProductCard
            product={product}
            onAddToCart={onAddToCart}
          />
        </ScrollFrameAnimation>
      ))}
    </div>
  );
}
