import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../types';
import { classNames, tagLabel, truncate } from '../lib/format';
import { Price } from './ui/Price';
import { Rating } from './ui/Rating';
import { Badge } from './ui/Badge';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from './ui/Toast';
import { useAuth } from '../context/AuthContext';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { has, toggle } = useWishlist();
  const { add } = useCart();
  const { user } = useAuth();
  const { push } = useToast();
  const inWishlist = has(product.id);

  const image = product.product_images?.[0]?.url;
  const alt = product.product_images?.[0]?.alt_text ?? product.title;
  const primaryTag = product.tags?.[0];

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      push('Sign in to add items to your cart.', 'info');
      return;
    }
    try {
      await add(product.id, product.product_variants?.[0]?.id ?? null, 1);
      push('Added to cart', 'success');
    } catch {
      push('Could not add to cart', 'error');
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      push('Sign in to save items.', 'info');
      return;
    }
    try {
      const nowIn = await toggle(product);
      push(nowIn ? 'Saved to wishlist' : 'Removed from wishlist', nowIn ? 'success' : 'info');
    } catch {
      push('Could not update wishlist', 'error');
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-ink-300 hover:shadow-card dark:border-ink-800 dark:bg-ink-900 dark:hover:border-ink-700"
      style={{ animationDelay: `${Math.min(index * 50, 400)}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-ink-100 dark:bg-ink-800">
        {image ? (
          <img
            src={image}
            alt={alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-300">
            <ShoppingBag size={32} />
          </div>
        )}
        {primaryTag && (
          <div className="absolute left-3 top-3">
            <Badge variant={primaryTag === 'new' ? 'accent' : 'dark'}>{tagLabel(primaryTag)}</Badge>
          </div>
        )}
        <button
          onClick={handleWishlist}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={classNames(
            'absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110 dark:bg-ink-900/80',
            inWishlist ? 'text-accent-500' : 'text-ink-500 hover:text-accent-500',
          )}
        >
          <Heart size={17} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={handleAdd}
          aria-label="Add to cart"
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-ink-900 text-white opacity-0 shadow-lift transition-all duration-300 hover:bg-accent-500 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-white dark:text-ink-900"
        >
          <ShoppingBag size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-500">
          {product.brand?.name}
        </p>
        <h3 className="text-sm font-medium leading-snug text-ink-900 dark:text-ink-100">
          {truncate(product.title, 48)}
        </h3>
        {product.rating_count > 0 && <Rating value={product.rating} count={product.rating_count} size="sm" />}
        <div className="mt-auto pt-1">
          <Price price={Number(product.price)} compareAt={product.compare_at_price ? Number(product.compare_at_price) : null} size="md" />
        </div>
      </div>
    </Link>
  );
}
