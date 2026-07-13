import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { Search, ShoppingBag, Heart, User, Menu, X, Sun, Moon, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { classNames, formatPrice, truncate } from '../../lib/format';
import { searchSuggestions } from '../../lib/queries';
import type { Product, Category } from '../../types';

const NAV: Array<{ label: string; slug: string; children?: Array<{ label: string; slug: string }> }> = [
  { label: 'New', slug: 'new' },
  { label: 'Apparel', slug: 'apparel', children: [
    { label: 'Tops', slug: 'tops' },
    { label: 'Bottoms', slug: 'bottoms' },
  ]},
  { label: 'Footwear', slug: 'footwear', children: [
    { label: 'Sneakers', slug: 'sneakers' },
  ]},
  { label: 'Electronics', slug: 'electronics' },
  { label: 'Accessories', slug: 'accessories' },
  { label: 'Home', slug: 'home' },
];

export function Header({ categories, onOpenCart }: { categories: Category[]; onOpenCart: () => void }) {
  const { count } = useCart();
  const { products: wishlistProducts } = useWishlist();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [megaOpen, setMegaOpen] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await searchSuggestions(searchTerm, 5);
        setResults(r);
      } catch {
        setResults([]);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  return (
    <>
      <header
        className={classNames(
          'sticky top-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-ink-200/70 bg-white/85 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/85'
            : 'border-b border-transparent bg-white dark:bg-ink-950',
        )}
      >
        <div className="container-page flex h-16 items-center gap-4 lg:h-18">
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link to="/" className="flex items-center gap-2" aria-label="Maison home">
            <span className="font-display text-xl font-semibold tracking-tight text-ink-900 dark:text-ink-100">
              Maison
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {NAV.map((item) => (
              <div
                key={item.slug}
                className="relative"
                onMouseEnter={() => setMegaOpen(item.slug)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <NavLink
                  to={item.slug === 'new' ? '/shop?tags=new' : `/shop?category=${item.slug}`}
                  className={({ isActive }) =>
                    classNames(
                      'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-ink-900 dark:text-white'
                        : 'text-ink-600 hover:text-ink-900 dark:text-ink-300 dark:hover:text-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
                {item.children && megaOpen === item.slug && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-56 overflow-hidden rounded-2xl border border-ink-200 bg-white p-2 shadow-card animate-scale-in dark:border-ink-800 dark:bg-ink-900">
                      {item.children.map((c) => (
                        <Link
                          key={c.slug}
                          to={`/shop?category=${c.slug}`}
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-ink-700 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
                        >
                          {c.label}
                          <ChevronRight size={15} className="text-ink-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label="Search"
                className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
              >
                <Search size={20} />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-[min(90vw,420px)] overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-lift animate-scale-in dark:border-ink-800 dark:bg-ink-900">
                  <form onSubmit={submitSearch} className="flex items-center gap-2 border-b border-ink-100 p-3 dark:border-ink-800">
                    <Search size={18} className="text-ink-400" />
                    <input
                      autoFocus
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search products, brands…"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
                    />
                    {searchTerm && (
                      <button type="button" onClick={() => setSearchTerm('')} aria-label="Clear search">
                        <X size={16} className="text-ink-400" />
                      </button>
                    )}
                  </form>
                  {results.length > 0 && (
                    <div className="max-h-[60vh] overflow-y-auto p-2">
                      {results.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-ink-100 dark:hover:bg-ink-800"
                        >
                          <img
                            src={p.product_images?.[0]?.url}
                            alt={p.title}
                            className="h-12 w-12 rounded-lg object-cover"
                            loading="lazy"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-100">{p.title}</p>
                            <p className="text-xs text-ink-400">{formatPrice(Number(p.price))}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchTerm.length >= 2 && results.length === 0 && (
                    <p className="p-4 text-sm text-ink-400">No products found for "{truncate(searchTerm, 30)}"</p>
                  )}
                  {!searchTerm && (
                    <div className="p-3">
                      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-ink-400">Popular</p>
                      <div className="flex flex-wrap gap-2">
                        {['Sneakers', 'Headphones', 'Backpack', 'Merino', 'Linen'].map((t) => (
                          <button
                            key={t}
                            onClick={() => navigate(`/shop?search=${encodeURIComponent(t)}`) || setSearchOpen(false)}
                            className="chip bg-ink-100 text-ink-700 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link
              to="/account?tab=wishlist"
              aria-label="Wishlist"
              className="relative hidden h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 sm:grid"
            >
              <Heart size={20} />
              {wishlistProducts.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-semibold text-white">
                  {wishlistProducts.length}
                </span>
              )}
            </Link>

            <Link
              to={user ? '/account' : '/signin'}
              aria-label="Account"
              className="grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <User size={20} />
            </Link>

            <button
              onClick={onOpenCart}
              aria-label="Cart"
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink-600 transition hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800"
            >
              <ShoppingBag size={20} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-ink-900 px-1 text-[10px] font-semibold text-white dark:bg-white dark:text-ink-900">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <MobileNav categories={categories} onClose={() => setMobileOpen(false)} onSearch={submitSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} user={user} onSignOut={signOut} />
      )}
    </>
  );
}

function MobileNav({
  categories,
  onClose,
  searchTerm,
  setSearchTerm,
  onSearch,
  user,
  onSignOut,
}: {
  categories: Category[];
  onClose: () => void;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  onSearch: (e: React.FormEvent) => void;
  user: ReturnType<typeof useAuth>['user'];
  onSignOut: () => Promise<void>;
}) {
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[84%] max-w-sm overflow-y-auto bg-white p-5 shadow-lift animate-slide-in-right dark:bg-ink-950">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold">Maison</span>
          <button onClick={onClose} aria-label="Close menu"><X size={22} /></button>
        </div>
        <form onSubmit={onSearch} className="mt-4 flex items-center gap-2 rounded-xl border border-ink-200 px-3 py-2.5 dark:border-ink-700">
          <Search size={18} className="text-ink-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink-400"
          />
        </form>
        <nav className="mt-5 space-y-1">
          <Link to="/" onClick={onClose} className="block rounded-xl px-3 py-3 text-base font-medium hover:bg-ink-100 dark:hover:bg-ink-800">Home</Link>
          <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-ink-400">Shop</p>
          {categories.map((c) => (
            <Link key={c.id} to={`/shop?category=${c.slug}`} onClick={onClose} className="block rounded-xl px-3 py-2.5 text-sm hover:bg-ink-100 dark:hover:bg-ink-800">
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-ink-200 pt-4 dark:border-ink-800">
          {user ? (
            <>
              <Link to="/account" onClick={onClose} className="block rounded-xl px-3 py-3 text-sm font-medium hover:bg-ink-100 dark:hover:bg-ink-800">My Account</Link>
              <button onClick={() => { onSignOut(); onClose(); }} className="block w-full rounded-xl px-3 py-3 text-left text-sm hover:bg-ink-100 dark:hover:bg-ink-800">Sign out</button>
            </>
          ) : (
            <>
              <Link to="/signin" onClick={onClose} className="block rounded-xl bg-ink-900 px-3 py-3 text-center text-sm font-medium text-white dark:bg-white dark:text-ink-900">Sign in</Link>
              <Link to="/signup" onClick={onClose} className="mt-2 block rounded-xl px-3 py-3 text-center text-sm border border-ink-200 dark:border-ink-700">Create account</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
