import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { fetchCategories } from '../../lib/queries';
import type { Category } from '../../types';

export function Layout() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [location.pathname, location.search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories} onOpenCart={() => setCartOpen(true)} />
      <main className="flex-1">
        <Outlet context={{ openCart: () => setCartOpen(true) }} />
      </main>
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
