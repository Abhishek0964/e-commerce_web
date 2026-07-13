import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { CartItem } from '../types';
import { fetchCartItems, addToCart, updateCartQuantity, removeFromCart } from '../lib/queries';
import { useAuth } from './AuthContext';

type CartState = {
  items: CartItem[];
  loading: boolean;
  count: number;
  subtotal: number;
  add: (productId: string, variantId: string | null, quantity?: number) => Promise<void>;
  update: (itemId: string, quantity: number) => Promise<void>;
  remove: (itemId: string) => Promise<void>;
  clear: () => void;
  refresh: () => Promise<void>;
};

const CartContext = createContext<CartState | undefined>(undefined);

function itemPrice(item: CartItem): number {
  if (item.variant?.price_override != null) return Number(item.variant.price_override);
  return Number(item.product?.price ?? 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await fetchCartItems();
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (productId: string, variantId: string | null, quantity = 1) => {
      if (!user) throw new Error('Sign in to add items to your cart.');
      await addToCart(productId, variantId, quantity);
      await refresh();
    },
    [user, refresh],
  );

  const update = useCallback(
    async (itemId: string, quantity: number) => {
      await updateCartQuantity(itemId, Math.max(1, quantity));
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (itemId: string) => {
      await removeFromCart(itemId);
      await refresh();
    },
    [refresh],
  );

  const clear = useCallback(() => setItems([]), []);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, count, subtotal, add, update, remove, clear, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
