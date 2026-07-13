import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Product } from '../types';
import { fetchWishlist, toggleWishlist as toggleQuery } from '../lib/queries';
import { useAuth } from './AuthContext';

type WishlistState = {
  productIds: Set<string>;
  products: Product[];
  loading: boolean;
  has: (productId: string) => boolean;
  toggle: (product: Product) => Promise<boolean>;
  refresh: () => Promise<void>;
};

const WishlistContext = createContext<WishlistState | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchWishlist();
      setProducts(data.map((w) => w.product).filter((p): p is Product => !!p));
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const productIds = new Set(products.map((p) => p.id));

  const has = useCallback((productId: string) => productIds.has(productId), [productIds]);

  const toggle = useCallback(
    async (product: Product) => {
      if (!user) throw new Error('Sign in to save items to your wishlist.');
      const inList = productIds.has(product.id);
      await toggleQuery(product.id, inList);
      await refresh();
      return !inList;
    },
    [user, productIds, refresh],
  );

  return (
    <WishlistContext.Provider value={{ productIds, products, loading, has, toggle, refresh }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistState {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
