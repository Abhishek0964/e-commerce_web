import { Link } from 'react-router-dom';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice, classNames } from '../../lib/format';
import { Spinner } from '../ui/Spinner';

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, loading, subtotal, update, remove } = useCart();

  return (
    <div className={classNames('fixed inset-0 z-[70]', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div
        className={classNames('absolute inset-0 bg-ink-950/40 backdrop-blur-sm transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')}
        onClick={onClose}
        aria-hidden
      />
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={classNames(
          'absolute right-0 top-0 flex h-full w-[min(92vw,440px)] flex-col bg-white shadow-lift transition-transform duration-300 dark:bg-ink-950',
          open ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-200 px-5 py-4 dark:border-ink-800">
          <h2 className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag size={18} /> Your Cart
          </h2>
          <button onClick={onClose} aria-label="Close cart" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800">
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center"><Spinner size={24} /></div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="text-base font-medium text-ink-900 dark:text-ink-100">Your cart is empty</p>
              <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Add something you love.</p>
            </div>
            <Link to="/shop" onClick={onClose} className="btn-primary">Browse products</Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const price = item.variant?.price_override != null ? Number(item.variant.price_override) : Number(item.product?.price ?? 0);
                  const img = item.product?.product_images?.[0]?.url;
                  return (
                    <li key={item.id} className="flex gap-3">
                      <Link to={`/product/${item.product?.slug}`} onClick={onClose} className="shrink-0">
                        <img src={img} alt={item.product?.title} className="h-20 w-16 rounded-lg object-cover" loading="lazy" />
                      </Link>
                      <div className="min-w-0 flex-1">
                        <Link to={`/product/${item.product?.slug}`} onClick={onClose} className="block truncate text-sm font-medium hover:underline">
                          {item.product?.title}
                        </Link>
                        {item.variant && (
                          <p className="text-xs text-ink-500 dark:text-ink-400">{item.variant.name}: {item.variant.value}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold">{formatPrice(price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center rounded-full border border-ink-200 dark:border-ink-700">
                            <button onClick={() => update(item.id, item.quantity - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Decrease quantity">
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-sm font-medium">{item.quantity}</span>
                            <button onClick={() => update(item.id, item.quantity + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Increase quantity">
                              <Plus size={13} />
                            </button>
                          </div>
                          <button onClick={() => remove(item.id)} className="grid h-7 w-7 place-items-center rounded-full text-ink-400 hover:bg-error-500/10 hover:text-error-500" aria-label="Remove item">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">{formatPrice(price * item.quantity)}</p>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-ink-200 px-5 py-4 dark:border-ink-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-500 dark:text-ink-400">Subtotal</span>
                <span className="text-base font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-ink-400">Shipping &amp; taxes calculated at checkout.</p>
              <Link to="/checkout" onClick={onClose} className="btn-primary mt-4 w-full">
                Checkout <ArrowRight size={16} />
              </Link>
              <Link to="/shop" onClick={onClose} className="mt-2 block text-center text-sm text-ink-500 hover:text-ink-900 dark:hover:text-white">
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
