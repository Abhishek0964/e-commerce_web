import Link from 'next/link';
import { Product } from '@/lib/types';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="group h-full surface-elevated overflow-hidden hover:shadow-lg transition-shadow duration-200">
        {/* Product Image Container */}
        <div className="relative overflow-hidden bg-muted aspect-square">
          <img
            src={product.image}
            alt={product.imageAlt}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              // Fallback for broken images
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" font-family="system-ui" font-size="12" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />

          {/* Sale badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}

          {/* Stock status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-semibold">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Category */}
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {product.category}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent text-accent" />
              <span className="text-sm font-medium">{product.rating}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
          <div
            onClick={(e) => {
              e.preventDefault();
            }}
            className="pt-2"
          >
            <Button
              size="sm"
              className="w-full button-primary"
              disabled={!product.inStock}
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.(product.id);
              }}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
