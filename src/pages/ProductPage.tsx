import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw, ShieldCheck, ChevronRight,
  Star, Check, Share2,
} from 'lucide-react';
import { fetchProductBySlug, fetchRelatedProducts, fetchReviews, submitReview } from '../lib/queries';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { Rating } from '../components/ui/Rating';
import { Price } from '../components/ui/Price';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { ProductCard } from '../components/ProductCard';
import { classNames, tagLabel, formatDate } from '../lib/format';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Product, Review, ProductVariant } from '../types';

type OutletCtx = { openCart: () => void };

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { openCart } = useOutletContext<OutletCtx>();
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const { user } = useAuth();
  const { push } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<'description' | 'reviews' | 'shipping'>('description');

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);
    (async () => {
      try {
        const p = await fetchProductBySlug(slug);
        if (!mounted) return;
        setProduct(p);
        setSelectedVariant(p?.product_variants?.[0] ?? null);
        if (p) {
          const [rel, revs] = await Promise.all([fetchRelatedProducts(p), fetchReviews(p.id)]);
          if (!mounted) return;
          setRelated(rel);
          setReviews(revs);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [slug]);

  useDocumentTitle(product?.title, product?.description ?? undefined);

  if (loading) {
    return (
      <div className="container-page flex items-center justify-center py-32">
        <Spinner size={28} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-page flex flex-col items-center gap-4 py-32 text-center">
        <p className="text-xl font-semibold">Product not found</p>
        <Link to="/shop" className="btn-primary">Back to shop</Link>
      </div>
    );
  }

  const images = product.product_images ?? [];
  const variants = product.product_variants ?? [];
  const inWishlist = has(product.id);
  const stock = selectedVariant?.inventory_count ?? product.inventory_count;
  const inStock = stock > 0;
  const effectivePrice = selectedVariant?.price_override != null ? Number(selectedVariant.price_override) : Number(product.price);
  const ratingAvg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : product.rating;

  const handleAdd = async () => {
    if (!user) {
      push('Sign in to add items to your cart.', 'info');
      navigate('/signin');
      return;
    }
    setAdding(true);
    try {
      await add(product.id, selectedVariant?.id ?? null, quantity);
      push('Added to cart', 'success');
      openCart();
    } catch {
      push('Could not add to cart', 'error');
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) {
      push('Sign in to save items.', 'info');
      navigate('/signin');
      return;
    }
    try {
      const nowIn = await toggle(product);
      push(nowIn ? 'Saved to wishlist' : 'Removed from wishlist', nowIn ? 'success' : 'info');
    } catch {
      push('Could not update wishlist', 'error');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        push('Link copied', 'success');
      }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="container-page py-6 lg:py-10">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink-700 dark:hover:text-ink-300">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-ink-700 dark:hover:text-ink-300">Shop</Link>
        {product.category && <>
          <ChevronRight size={12} />
          <Link to={`/shop?category=${product.category.slug}`} className="hover:text-ink-700 dark:hover:text-ink-300">{product.category.name}</Link>
        </>}
        <ChevronRight size={12} />
        <span className="text-ink-600 dark:text-ink-300">{product.title}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-ink-100 dark:bg-ink-800">
            {images[activeImage] ? (
              <img
                src={images[activeImage].url}
                alt={images[activeImage].alt_text ?? product.title}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div className="grid h-full place-items-center text-ink-300"><ShoppingBag size={40} /></div>
            )}
            {product.compare_at_price && (
              <div className="absolute left-4 top-4"><Badge variant="accent">Save {Math.round((1 - Number(product.price) / Number(product.compare_at_price)) * 100)}%</Badge></div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={classNames(
                    'relative h-20 w-16 overflow-hidden rounded-xl border-2 transition',
                    activeImage === i ? 'border-ink-900 dark:border-white' : 'border-transparent opacity-70 hover:opacity-100',
                  )}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img.url} alt={img.alt_text ?? ''} className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.brand && (
            <Link to={`/shop?brand=${product.brand.slug}`} className="text-sm font-medium uppercase tracking-wide text-ink-500 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
              {product.brand.name}
            </Link>
          )}
          <h1 className="mt-2 text-h1 font-display font-semibold leading-tight">{product.title}</h1>

          <div className="mt-3 flex items-center gap-4">
            <Rating value={ratingAvg} count={product.rating_count + reviews.length} size="lg" />
            <button onClick={() => setTab('reviews')} className="text-sm text-ink-500 hover:text-ink-900 link-underline dark:hover:text-white">
              {reviews.length} reviews
            </button>
          </div>

          <div className="mt-5">
            <Price price={effectivePrice} compareAt={product.compare_at_price ? Number(product.compare_at_price) : null} size="lg" />
          </div>

          {product.description && (
            <p className="mt-5 text-ink-600 dark:text-ink-300 leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">{variants[0].name}</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    disabled={v.inventory_count === 0}
                    className={classNames(
                      'min-w-11 rounded-xl border px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40',
                      selectedVariant?.id === v.id
                        ? 'border-ink-900 bg-ink-900 text-white dark:border-white dark:bg-white dark:text-ink-900'
                        : 'border-ink-200 hover:border-ink-400 dark:border-ink-700 dark:hover:border-ink-500',
                    )}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + add to cart */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink-200 dark:border-ink-700">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Decrease quantity">
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Increase quantity">
                <Plus size={16} />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!inStock || adding}
              className="btn-primary flex-1"
            >
              {adding ? <Spinner size={18} /> : <ShoppingBag size={18} />}
              {inStock ? 'Add to cart' : 'Out of stock'}
            </button>
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              className={classNames(
                'grid h-11 w-11 place-items-center rounded-full border transition',
                inWishlist ? 'border-accent-500 text-accent-500' : 'border-ink-200 text-ink-500 hover:border-accent-500 hover:text-accent-500 dark:border-ink-700',
              )}
            >
              <Heart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share product"
              className="grid h-11 w-11 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-ink-900 hover:text-ink-900 dark:border-ink-700 dark:hover:border-white"
            >
              <Share2 size={18} />
            </button>
          </div>

          {/* Stock + trust */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {inStock ? (
              <span className="flex items-center gap-1.5 text-success-600 dark:text-success-500">
                <Check size={16} /> In stock{stock <= 10 ? ` — only ${stock} left` : ''}
              </span>
            ) : (
              <span className="text-error-500">Out of stock</span>
            )}
            {product.tags?.includes('bestseller') && <span className="text-accent-600 dark:text-accent-400">Bestseller</span>}
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-ink-200 p-4 dark:border-ink-800 sm:grid-cols-3">
            <Trust icon={Truck} title="Free shipping" desc="Orders over ₹1,500" />
            <Trust icon={RotateCcw} title="30-day returns" desc="Easy & free" />
            <Trust icon={ShieldCheck} title="2-year warranty" desc="On all products" />
          </div>

          {/* Tabs */}
          <div className="mt-8 border-b border-ink-200 dark:border-ink-800">
            <div className="flex gap-6">
              {([
                { key: 'description', label: 'Details' },
                { key: 'reviews', label: `Reviews (${reviews.length})` },
                { key: 'shipping', label: 'Shipping & returns' },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={classNames(
                    'relative pb-3 text-sm font-medium transition',
                    tab === t.key ? 'text-ink-900 dark:text-white' : 'text-ink-500 hover:text-ink-700 dark:text-ink-400',
                  )}
                >
                  {t.label}
                  {tab === t.key && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-ink-900 dark:bg-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            {tab === 'description' && (
              <div className="space-y-3 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                <p>{product.description}</p>
                <ul className="space-y-1.5">
                  {product.tags?.map((t) => (
                    <li key={t} className="flex items-center gap-2"><Check size={15} className="text-success-500" /> {tagLabel(t)}</li>
                  ))}
                </ul>
              </div>
            )}
            {tab === 'reviews' && (
              <ReviewsTab productId={product.id} reviews={reviews} onSubmitted={(r) => setReviews((prev) => [r, ...prev])} />
            )}
            {tab === 'shipping' && (
              <div className="space-y-3 text-sm text-ink-600 dark:text-ink-300 leading-relaxed">
                <p><strong className="text-ink-900 dark:text-white">Shipping.</strong> Free standard shipping on orders over ₹1,500. Expedited and overnight options at checkout. Most orders ship within 1 business day.</p>
                <p><strong className="text-ink-900 dark:text-white">Returns.</strong> Return any item within 30 days for a full refund — no questions asked. Items must be unworn with original tags.</p>
                <p><strong className="text-ink-900 dark:text-white">Warranty.</strong> Every product is backed by a 2-year warranty against manufacturing defects.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="text-h2 font-display font-semibold">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      )}

      <ProductJsonLd product={product} ratingAvg={ratingAvg} reviewCount={reviews.length} />
    </div>
  );
}

function Trust({ icon: Icon, title, desc }: { icon: typeof Truck; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon size={20} className="shrink-0 text-accent-500" />
      <div>
        <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">{title}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400">{desc}</p>
      </div>
    </div>
  );
}

function ReviewsTab({ productId, reviews, onSubmitted }: { productId: string; reviews: Review[]; onSubmitted: (r: Review) => void }) {
  const { user } = useAuth();
  const { push } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ authorName: '', rating: 5, title: '', body: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const r = await submitReview(productId, form.authorName, form.rating, form.title, form.body);
      onSubmitted(r);
      setShowForm(false);
      setForm({ authorName: '', rating: 5, title: '', body: '' });
      push('Review posted', 'success');
    } catch {
      push('Could not post review', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));
  const total = reviews.length;

  return (
    <div>
      {total > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-semibold">{(reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)}</span>
              <span className="text-sm text-ink-400">out of 5</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {distribution.map((d) => (
                <div key={d.star} className="flex items-center gap-2 text-xs">
                  <span className="flex w-10 items-center gap-0.5 text-ink-500">{d.star}<Star size={11} className="fill-accent-500 text-accent-500" /></span>
                  <div className="h-1.5 w-32 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
                    <div className="h-full bg-accent-500" style={{ width: `${total ? (d.count / total) * 100 : 0}%` }} />
                  </div>
                  <span className="text-ink-400">{d.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 space-y-5">
            {reviews.map((r) => (
              <div key={r.id} className="border-b border-ink-100 pb-5 dark:border-ink-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{r.author_name}</p>
                    <Rating value={r.rating} size="sm" showValue={false} />
                  </div>
                  <span className="text-xs text-ink-400">{formatDate(r.created_at)}</span>
                </div>
                {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{r.body}</p>}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-ink-500 dark:text-ink-400">No reviews yet. Be the first to share your thoughts.</p>
      )}

      <div className="mt-6">
        {showForm ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-ink-200 p-5 dark:border-ink-800">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">Your name</label>
                <input required value={form.authorName} onChange={(e) => setForm({ ...form, authorName: e.target.value })} className="input" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} type="button" onClick={() => setForm({ ...form, rating: s })} aria-label={`${s} stars`}>
                      <Star size={24} className={classNames(s <= form.rating ? 'fill-accent-500 text-accent-500' : 'text-ink-300 dark:text-ink-600')} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Great product" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">Review</label>
              <textarea required value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="input min-h-24 resize-y" placeholder="Share your experience…" />
            </div>
            <div className="flex gap-2">
              <button type="submit" disabled={submitting} className="btn-primary">{submitting ? 'Posting…' : 'Post review'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            </div>
            {!user && <p className="text-xs text-ink-400">You'll be asked to sign in to post.</p>}
          </form>
        ) : (
          <button onClick={() => setShowForm(true)} className="btn-secondary">Write a review</button>
        )}
      </div>
    </div>
  );
}

function ProductJsonLd({ product, ratingAvg, reviewCount }: { product: Product; ratingAvg: number; reviewCount: number }) {
  const json = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    brand: { '@type': 'Brand', name: product.brand?.name },
    image: product.product_images?.map((i) => i.url),
    sku: product.sku,
    aggregateRating: reviewCount > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: ratingAvg.toFixed(1),
      reviewCount,
    } : undefined,
    offers: {
      '@type': 'Offer',
      price: Number(product.price),
      priceCurrency: product.currency,
      availability: product.inventory_count > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}
