'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getProductById, getProducts } from '@/lib/api';
import { Product } from '@/lib/types';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { ProductCard } from '@/components/products/product-card';
import { ScrollFrameAnimation } from '@/components/animations/scroll-frame-animation';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(productId);
        setProduct(data);

        if (data) {
          // Load related products from same category
          const related = await getProducts({
            category: data.category,
            limit: 4,
          });
          setRelatedProducts(
            related.products.filter((p) => p.id !== productId).slice(0, 4)
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  const handleAddToCart = () => {
    console.log('[ShopHub] Add to cart:', productId, 'Quantity:', quantity);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-96 bg-muted rounded-lg animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-6 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-20 w-full bg-muted rounded animate-pulse" />
            <div className="h-10 w-40 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product not found</h1>
          <Button href="/products">Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      {/* Product detail */}
      <ScrollFrameAnimation className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product image */}
        <div className="surface-elevated overflow-hidden rounded-lg">
          <div className="relative aspect-square bg-muted overflow-hidden">
            <img
              src={product.image}
              alt={product.imageAlt}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
              }}
            />

            {/* Sale badge */}
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold">
                {Math.round(
                  ((product.originalPrice - product.price) / product.originalPrice) * 100
                )}
                % OFF
              </div>
            )}
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">
                {product.rating}
              </span>
              <span className="text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-lg text-muted-foreground">
            {product.description}
          </p>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-accent font-semibold">
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </p>
          </div>

          {/* Quantity and actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-input rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-secondary transition-colors"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-6 py-2 font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                in stock
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 button-primary"
                disabled={!product.inStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleWishlist}
                className={isWishlisted ? 'bg-secondary' : ''}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-accent text-accent' : ''
                  }`}
                />
              </Button>
            </div>
          </div>

          {/* Features */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground mb-3">Features:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-secondary text-foreground rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollFrameAnimation>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <ScrollFrameAnimation className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <ScrollFrameAnimation
                key={relatedProduct.id}
                delay={index * 0.1}
                className="h-full"
              >
                <ProductCard product={relatedProduct} />
              </ScrollFrameAnimation>
            ))}
          </div>
        </ScrollFrameAnimation>
      )}
    </div>
  );
}
