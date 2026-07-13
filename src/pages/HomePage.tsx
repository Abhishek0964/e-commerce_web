import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { fetchProducts, fetchCategories } from '../lib/queries';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Badge } from '../components/ui/Badge';
import { formatPrice, classNames, tagLabel } from '../lib/format';
import type { Product, Category } from '../types';

export function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [featuredRes, dealsRes, cats] = await Promise.all([
          fetchProducts({ limit: 8, sort: 'relevance' }),
          fetchProducts({ onSaleOnly: true, sort: 'relevance', limit: 4 }),
          fetchCategories(),
        ]);
        if (!mounted) return;
        setFeatured(featuredRes.items.filter((p) => p.is_featured).concat(featuredRes.items).slice(0, 8));
        setDeals(dealsRes.items);
        setCategories(cats.filter((c) => c.parent_id === null));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useDocumentTitle(undefined, 'Maison — a curated marketplace for premium apparel, footwear, electronics, and home goods.');

  return (
    <div>
      <Hero />
      <TrustBar />

      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">Shop by category</p>
            <h2 className="mt-1 text-h2 font-display font-semibold">Explore the edit</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium link-underline sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?category=${c.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <img
                src={c.image_url ?? ''}
                alt={c.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <p className="text-lg font-medium text-white">{c.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-white/80 opacity-0 transition group-hover:opacity-100">
                  Shop now <ArrowRight size={12} />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">Handpicked</p>
            <h2 className="mt-1 text-h2 font-display font-semibold">Featured this week</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-medium link-underline sm:flex">
            View all <ArrowRight size={15} />
          </Link>
        </div>
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}>
                <ProductCard product={p} index={i} />
              </div>
            ))}
          </div>
        )}
      </section>

      {deals.length > 0 && (
        <section className="bg-ink-900 py-16 text-white dark:bg-ink-900">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-400">Limited time</p>
                <h2 className="mt-1 text-h2 font-display font-semibold">Deals you don't want to miss</h2>
              </div>
              <Link to="/shop?onSale=true" className="hidden items-center gap-1 text-sm font-medium link-underline sm:flex">
                All deals <ArrowRight size={15} />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {deals.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-ink-700 bg-ink-800 animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img src={p.product_images?.[0]?.url} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    {p.tags?.[0] && <div className="absolute left-3 top-3"><Badge variant="accent">{tagLabel(p.tags[0])}</Badge></div>}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-ink-400">{p.brand?.name}</p>
                    <p className="mt-1 truncate text-sm font-medium">{p.title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-semibold">{formatPrice(Number(p.price))}</span>
                      {p.compare_at_price && <span className="text-sm text-ink-400 line-through">{formatPrice(Number(p.compare_at_price))}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Newsletter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="container-page grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div className="animate-fade-up">
          <Badge variant="accent" className="mb-5">New season — just landed</Badge>
          <h1 className="text-display font-display font-semibold text-ink-900 dark:text-ink-100">
            Considered goods,<br />delivered.
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink-600 dark:text-ink-300">
            A curated marketplace for premium apparel, footwear, electronics, and home goods — chosen for design, made to last.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/shop" className="btn-primary">
              Shop the collection <ArrowRight size={16} />
            </Link>
            <Link to="/shop?tags=new" className="btn-secondary">New arrivals</Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-ink-500 dark:text-ink-400">
            <div><span className="text-xl font-semibold text-ink-900 dark:text-ink-100">200+</span><br />premium brands</div>
            <div className="h-10 w-px bg-ink-200 dark:bg-ink-800" />
            <div><span className="text-xl font-semibold text-ink-900 dark:text-ink-100">50k+</span><br />happy customers</div>
            <div className="h-10 w-px bg-ink-200 dark:bg-ink-800" />
            <div><span className="text-xl font-semibold text-ink-900 dark:text-ink-100">4.8★</span><br />avg. rating</div>
          </div>
        </div>
        <div className="relative animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
            <img
              src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="Featured collection"
              className="h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -left-4 bottom-8 hidden w-44 rounded-2xl border border-ink-200 bg-white/90 p-4 shadow-card backdrop-blur sm:block dark:border-ink-800 dark:bg-ink-900/90">
            <p className="text-xs text-ink-400">Editor's pick</p>
            <p className="mt-1 text-sm font-medium">Aurora Merino Crew</p>
            <p className="mt-1 text-sm font-semibold">₹7,304</p>
          </div>
          <div className="absolute -right-4 top-10 hidden w-40 rounded-2xl border border-ink-200 bg-white/90 p-4 shadow-card backdrop-blur sm:block dark:border-ink-800 dark:bg-ink-900/90">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-accent-500" />
              <p className="text-xs font-medium">Free shipping</p>
            </div>
            <p className="mt-1 text-xs text-ink-400">On orders over ₹1,500</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: Truck, label: 'Free shipping over ₹1,500' },
    { icon: RotateCcw, label: '30-day easy returns' },
    { icon: ShieldCheck, label: 'Secure checkout' },
    { icon: Sparkles, label: 'Curated by experts' },
  ];
  return (
    <div className="border-y border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-900">
      <div className="container-page grid grid-cols-2 gap-4 py-5 text-sm md:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className={classNames('flex items-center justify-center gap-2 text-ink-600 dark:text-ink-300')}>
            <it.icon size={18} className="text-accent-500" />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  return (
    <section className="container-page py-16">
      <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 text-center text-white sm:px-12 dark:bg-ink-900">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-400">Join the list</p>
          <h2 className="mt-2 text-h2 font-display font-semibold">Get early access to drops & deals</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-ink-300">
            Subscribe for first looks, member-only offers, and styling notes. No spam, unsubscribe anytime.
          </p>
          {done ? (
            <p className="mx-auto mt-6 max-w-sm rounded-xl bg-white/10 px-4 py-3 text-sm">Thanks for subscribing!</p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="mx-auto mt-6 flex max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-full border border-ink-700 bg-ink-800 px-5 py-3 text-sm text-white placeholder:text-ink-400 focus:border-accent-500 focus:outline-none"
              />
              <button type="submit" className="btn-accent shrink-0">Subscribe</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
