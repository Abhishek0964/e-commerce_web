import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown, Check, PackageX } from 'lucide-react';
import { fetchProducts, fetchBrands, fetchCategories } from '../lib/queries';
import { ProductCard } from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Spinner } from '../components/ui/Spinner';
import { classNames } from '../lib/format';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Product, Brand, Category, SortOption } from '../types';

const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'relevance', label: 'Most relevant' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: low to high' },
  { value: 'price_desc', label: 'Price: high to low' },
  { value: 'rating', label: 'Top rated' },
];

const PAGE_SIZE = 12;

export function ShopPage() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const categorySlug = params.get('category') ?? '';
  const brandSlug = params.get('brand') ?? '';
  const search = params.get('search') ?? '';
  const tagsParam = params.get('tags') ?? '';
  const onSale = params.get('onSale') === 'true';
  const sort = (params.get('sort') as SortOption) ?? 'relevance';
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined;
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined;
  const minRating = params.get('minRating') ? Number(params.get('minRating')) : undefined;
  const inStock = params.get('inStock') === 'true';
  const page = Number(params.get('page') ?? '1');

  useEffect(() => {
    fetchBrands().then(setBrands).catch(() => setBrands([]));
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  const activeTags = tagsParam ? tagsParam.split(',').filter(Boolean) : [];

  const buildQuery = useCallback(
    (pageNum: number) => ({
      categorySlug: categorySlug || undefined,
      brandSlug: brandSlug || undefined,
      search: search || undefined,
      tags: activeTags.length ? activeTags : undefined,
      onSaleOnly: onSale || undefined,
      sort,
      minPrice,
      maxPrice,
      minRating,
      inStockOnly: inStock || undefined,
      limit: PAGE_SIZE,
      offset: (pageNum - 1) * PAGE_SIZE,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [categorySlug, brandSlug, search, tagsParam, onSale, sort, minPrice, maxPrice, minRating, inStock],
  );

  // Load page 1 whenever filters change
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setProducts([]);
    fetchProducts(buildQuery(1))
      .then(({ items, total: t }) => {
        if (!mounted) return;
        setProducts(items);
        setTotal(t);
      })
      .catch(() => { if (mounted) { setProducts([]); setTotal(0); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [buildQuery]);

  const loadMore = useCallback(async () => {
    const next = page + 1;
    setLoadingMore(true);
    try {
      const { items } = await fetchProducts(buildQuery(next));
      setProducts((prev) => [...prev, ...items]);
      const nextParams = new URLSearchParams(params);
      nextParams.set('page', String(next));
      setParams(nextParams, { replace: true });
    } finally {
      setLoadingMore(false);
    }
  }, [buildQuery, page, params, setParams]);

  // Infinite scroll observer
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore && products.length < total) {
          loadMore();
        }
      },
      { rootMargin: '400px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loadMore, loading, loadingMore, products.length, total]);

  const updateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params);
    if (value === null || value === '') next.delete(key);
    else next.set(key, value);
    next.delete('page');
    setParams(next, { replace: true });
  };

  const toggleTag = (tag: string) => {
    const set = new Set(activeTags);
    if (set.has(tag)) set.delete(tag);
    else set.add(tag);
    updateParam('tags', set.size ? Array.from(set).join(',') : null);
  };

  const activeFilterCount =
    (categorySlug ? 1 : 0) + (brandSlug ? 1 : 0) + activeTags.length +
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (minRating ? 1 : 0) +
    (inStock ? 1 : 0) + (onSale ? 1 : 0) + (search ? 1 : 0);

  const clearAll = () => setParams(new URLSearchParams(), { replace: true });

  const heading = search
    ? `Results for "${search}"`
    : categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.name ?? 'Shop'
    : onSale
    ? 'Deals'
    : 'All products';

  useDocumentTitle(heading, `Shop ${heading.toLowerCase()} on Maison — premium products with fast shipping and easy returns.`);

  return (
    <div className="container-page py-8 lg:py-12">
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-ink-400" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink-700 dark:hover:text-ink-300">Home</Link>
        <span>/</span>
        <span className="text-ink-600 dark:text-ink-300">{heading}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 font-display font-semibold">{heading}</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{total} {total === 1 ? 'item' : 'items'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="btn-secondary lg:hidden"
            aria-label="Open filters"
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-accent-500 px-1 text-[10px] text-white">{activeFilterCount}</span>}
          </button>
          <div className="relative">
            <button
              onClick={() => setSortOpen((v) => !v)}
              className="btn-secondary"
              aria-haspopup="listbox"
              aria-expanded={sortOpen}
            >
              Sort: {SORT_OPTIONS.find((o) => o.value === sort)?.label} <ChevronDown size={15} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 shadow-card animate-scale-in dark:border-ink-800 dark:bg-ink-900">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { updateParam('sort', o.value === 'relevance' ? null : o.value); setSortOpen(false); }}
                    className={classNames(
                      'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition hover:bg-ink-100 dark:hover:bg-ink-800',
                      sort === o.value ? 'font-medium text-ink-900 dark:text-white' : 'text-ink-600 dark:text-ink-300',
                    )}
                  >
                    {o.label}
                    {sort === o.value && <Check size={15} className="text-accent-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <FilterPanel
            categories={categories}
            brands={brands}
            categorySlug={categorySlug}
            brandSlug={brandSlug}
            activeTags={activeTags}
            minPrice={minPrice}
            maxPrice={maxPrice}
            minRating={minRating}
            inStock={inStock}
            onSale={onSale}
            updateParam={updateParam}
            toggleTag={toggleTag}
            onClear={clearAll}
            activeCount={activeFilterCount}
          />
        </aside>

        <div className="min-w-0 flex-1">
          {activeFilterCount > 0 && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {categorySlug && <ActiveChip label={categories.find((c) => c.slug === categorySlug)?.name ?? categorySlug} onRemove={() => updateParam('category', null)} />}
              {brandSlug && <ActiveChip label={brands.find((b) => b.slug === brandSlug)?.name ?? brandSlug} onRemove={() => updateParam('brand', null)} />}
              {activeTags.map((t) => <ActiveChip key={t} label={t} onRemove={() => toggleTag(t)} />)}
              {onSale && <ActiveChip label="On sale" onRemove={() => updateParam('onSale', null)} />}
              {inStock && <ActiveChip label="In stock" onRemove={() => updateParam('inStock', null)} />}
              {minRating && <ActiveChip label={`${minRating}+ rating`} onRemove={() => updateParam('minRating', null)} />}
              {minPrice != null && <ActiveChip label={`Min ₹${minPrice}`} onRemove={() => updateParam('minPrice', null)} />}
              {maxPrice != null && <ActiveChip label={`Max ₹${maxPrice}`} onRemove={() => updateParam('maxPrice', null)} />}
              <button onClick={clearAll} className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400">Clear all</button>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : products.length === 0 ? (
            <EmptyState onClear={clearAll} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {products.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min((i % PAGE_SIZE) * 40, 300)}ms` }}>
                  <ProductCard product={p} index={i} />
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && products.length < total && (
            <div ref={sentinelRef} className="flex items-center justify-center py-10">
              {loadingMore ? <Spinner size={24} /> : <button onClick={loadMore} className="btn-secondary">Load more</button>}
            </div>
          )}
          {products.length > 0 && products.length >= total && (
            <p className="py-10 text-center text-sm text-ink-400">You've seen all {total} items</p>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute left-0 top-0 h-full w-[min(90vw,360px)] overflow-y-auto bg-white p-5 shadow-lift animate-slide-in-right dark:bg-ink-950">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Filters</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters"><X size={20} /></button>
            </div>
            <div className="mt-4">
              <FilterPanel
                categories={categories}
                brands={brands}
                categorySlug={categorySlug}
                brandSlug={brandSlug}
                activeTags={activeTags}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minRating={minRating}
                inStock={inStock}
                onSale={onSale}
                updateParam={updateParam}
                toggleTag={toggleTag}
                onClear={clearAll}
                activeCount={activeFilterCount}
              />
            </div>
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-6 w-full">Show {total} results</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-300">
      {label}
      <button onClick={onRemove} aria-label={`Remove ${label} filter`}><X size={12} /></button>
    </span>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
        <PackageX size={28} />
      </div>
      <div>
        <p className="text-base font-medium text-ink-900 dark:text-ink-100">No products found</p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Try adjusting your filters or search.</p>
      </div>
      <button onClick={onClear} className="btn-secondary">Clear filters</button>
    </div>
  );
}

type FilterProps = {
  categories: Category[];
  brands: Brand[];
  categorySlug: string;
  brandSlug: string;
  activeTags: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock: boolean;
  onSale: boolean;
  updateParam: (key: string, value: string | null) => void;
  toggleTag: (tag: string) => void;
  onClear: () => void;
  activeCount: number;
};

function FilterPanel(props: FilterProps) {
  const { categories, brands, categorySlug, brandSlug, activeTags, minPrice, maxPrice, minRating, inStock, onSale, updateParam, toggleTag, onClear, activeCount } = props;
  const rootCats = categories.filter((c) => c.parent_id === null);
  return (
    <div className="space-y-6">
      {activeCount > 0 && (
        <button onClick={onClear} className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400">Clear all filters</button>
      )}
      <FilterGroup title="Category">
        <div className="space-y-1.5">
          <FilterRow label="All categories" active={!categorySlug} onClick={() => updateParam('category', null)} />
          {rootCats.map((c) => (
            <FilterRow key={c.id} label={c.name} active={categorySlug === c.slug} onClick={() => updateParam('category', c.slug)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Brand">
        <div className="space-y-1.5">
          <FilterRow label="All brands" active={!brandSlug} onClick={() => updateParam('brand', null)} />
          {brands.map((b) => (
            <FilterRow key={b.id} label={b.name} active={brandSlug === b.slug} onClick={() => updateParam('brand', b.slug)} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Price">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice ?? ''}
            onChange={(e) => updateParam('minPrice', e.target.value || null)}
            className="input py-2 text-sm"
            min={0}
          />
          <span className="text-ink-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice ?? ''}
            onChange={(e) => updateParam('maxPrice', e.target.value || null)}
            className="input py-2 text-sm"
            min={0}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        <div className="space-y-1.5">
          <FilterRow label="All ratings" active={!minRating} onClick={() => updateParam('minRating', null)} />
          {[4, 3, 2].map((r) => (
            <FilterRow key={r} label={`${r}★ & up`} active={minRating === r} onClick={() => updateParam('minRating', String(r))} />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Tags">
        <div className="flex flex-wrap gap-2">
          {['new', 'bestseller', 'luxury'].map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={classNames(
                'chip capitalize transition',
                activeTags.includes(t)
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="space-y-1.5">
          <FilterRow label="On sale" active={onSale} onClick={() => updateParam('onSale', onSale ? null : 'true')} />
          <FilterRow label="In stock only" active={inStock} onClick={() => updateParam('inStock', inStock ? null : 'true')} />
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-400">{title}</p>
      {children}
    </div>
  );
}

function FilterRow({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm transition',
        active ? 'font-medium text-ink-900 dark:text-white' : 'text-ink-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-white',
      )}
    >
      {label}
      {active && <Check size={15} className="text-accent-500" />}
    </button>
  );
}
