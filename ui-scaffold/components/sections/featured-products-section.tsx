'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/product-card';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

interface FeaturedProductsSectionProps {
  title?: string;
  subtitle?: string;
  category?: string;
  limit?: number;
  showViewAll?: boolean;
}

export function FeaturedProductsSection({
  title = 'Best Sellers',
  subtitle = 'Shop our most popular products',
  category,
  limit = 4,
  showViewAll = true,
}: FeaturedProductsSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts({
          category,
          limit: 12, // Load more to ensure we have enough
          sortBy: 'popular',
        });
        setProducts(data.products.slice(0, limit));
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [category, limit]);

  const handleAddToCart = (productId: string) => {
    console.log('[ShopHub] Add to cart:', productId);
    // Will be implemented in cart task
  };

  if (isLoading) {
    return (
      <section className="bg-secondary/30 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
          <div className="text-center space-y-4 mb-12">
            <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto" />
            <div className="h-6 w-96 bg-muted rounded animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-secondary/30 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
        <ScrollFrameAnimation className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </ScrollFrameAnimation>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product, index) => (
            <ScrollFrameAnimation
              key={product.id}
              delay={index * 0.1}
              className="h-full"
            >
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
              />
            </ScrollFrameAnimation>
          ))}
        </div>

        {showViewAll && (
          <ScrollFrameAnimation className="flex justify-center">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </ScrollFrameAnimation>
        )}
      </div>
    </section>
  );
}
