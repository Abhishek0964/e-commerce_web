import { useEffect, useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Check, Lock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { fetchAddresses, placeOrder } from '../lib/queries';
import { useToast } from '../components/ui/Toast';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, generateOrderNumber, classNames } from '../lib/format';
import type { Address } from '../types';

const SHIPPING_RATE = 150;
const FREE_SHIPPING_THRESHOLD = 1500;
const TAX_RATE = 0.08;

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clear } = useCart();
  const { push } = useToast();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  const [email, setEmail] = useState(user?.email ?? '');
  const [fullName, setFullName] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  useDocumentTitle('Checkout');

  useEffect(() => {
    fetchAddresses().then((data) => {
      setAddresses(data);
      const def = data.find((a) => a.is_default) ?? data[0];
      if (def) setSelectedAddressId(def.id);
    }).catch(() => setAddresses([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedAddressId) {
      const a = addresses.find((x) => x.id === selectedAddressId);
      if (a) {
        setFullName(a.full_name);
        setLine1(a.line1);
        setLine2(a.line2 ?? '');
        setCity(a.city);
        setState(a.state);
        setPostalCode(a.postal_code);
        setCountry(a.country);
      }
    }
  }, [selectedAddressId, addresses]);

  if (loading) return <div className="container-page flex justify-center py-32"><Spinner size={28} /></div>;
  if (!user) return <Navigate to="/signin" state={{ from: '/checkout' }} replace />;
  if (items.length === 0) return <Navigate to="/shop" replace />;

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_RATE;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlacing(true);
    try {
      const order = await placeOrder({
        order_number: generateOrderNumber(),
        subtotal,
        shipping,
        tax,
        total,
        currency: 'INR',
        email,
        shipping_address: { fullName, line1, line2, city, state, postalCode, country },
        items: items.map((it) => ({
          product_id: it.product_id,
          variant_id: it.variant_id,
          title: it.product?.title ?? 'Item',
          image_url: it.product?.product_images?.[0]?.url ?? null,
          variant_name: it.variant ? `${it.variant.name}: ${it.variant.value}` : null,
          quantity: it.quantity,
          unit_price: it.variant?.price_override != null ? Number(it.variant.price_override) : Number(it.product?.price ?? 0),
        })),
      });
      clear();
      navigate(`/order/${order.order_number}`, { state: { order, email } });
    } catch {
      push('Could not place order. Please try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <nav className="mb-4 text-xs text-ink-400">
        <Link to="/shop" className="hover:text-ink-700 dark:hover:text-ink-300">Shop</Link> / Checkout
      </nav>
      <h1 className="text-h1 font-display font-semibold">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="mt-8 grid gap-10 lg:grid-cols-[1fr_400px]">
        <div className="space-y-8">
          {addresses.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">Saved address</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAddressId(a.id)}
                    className={classNames(
                      'rounded-2xl border p-4 text-left transition',
                      selectedAddressId === a.id ? 'border-ink-900 ring-2 ring-ink-900/10 dark:border-white' : 'border-ink-200 hover:border-ink-300 dark:border-ink-700',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{a.label}</p>
                      {selectedAddressId === a.id && <Check size={16} className="text-accent-500" />}
                    </div>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">{a.full_name}, {a.city}, {a.state} {a.postal_code}</p>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedAddressId(null)}
                  className={classNames(
                    'rounded-2xl border p-4 text-left text-sm transition',
                    !selectedAddressId ? 'border-ink-900 ring-2 ring-ink-900/10 dark:border-white' : 'border-ink-200 hover:border-ink-300 dark:border-ink-700',
                  )}
                >
                  + Enter a new address
                </button>
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">Contact</h2>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="input" />
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">Shipping address</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="input sm:col-span-2" />
              <input required value={line1} onChange={(e) => setLine1(e.target.value)} placeholder="Address line 1" className="input sm:col-span-2" />
              <input value={line2} onChange={(e) => setLine2(e.target.value)} placeholder="Apartment, suite (optional)" className="input sm:col-span-2" />
              <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="input" />
              <input required value={state} onChange={(e) => setState(e.target.value)} placeholder="State / Province" className="input" />
              <input required value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="Postal code" className="input" />
              <input required value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Country" className="input" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-400">Payment</h2>
            <div className="rounded-2xl border border-ink-200 p-5 dark:border-ink-800">
              <div className="flex items-center gap-2 text-sm text-ink-500">
                <Lock size={16} /> This is a demo store — no real payment is processed.
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input disabled placeholder="Card number" className="input opacity-60" />
                <div className="grid grid-cols-2 gap-3">
                  <input disabled placeholder="MM / YY" className="input opacity-60" />
                  <input disabled placeholder="CVC" className="input opacity-60" />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card overflow-hidden">
            <div className="border-b border-ink-100 px-5 py-4 dark:border-ink-800">
              <h2 className="flex items-center gap-2 text-sm font-semibold"><ShoppingBag size={16} /> Order summary</h2>
            </div>
            <div className="max-h-72 overflow-y-auto px-5 py-3">
              {items.map((it) => {
                const price = it.variant?.price_override != null ? Number(it.variant.price_override) : Number(it.product?.price ?? 0);
                return (
                  <div key={it.id} className="flex items-center gap-3 py-2">
                    <img src={it.product?.product_images?.[0]?.url} alt={it.product?.title} className="h-12 w-10 rounded-lg object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{it.product?.title}</p>
                      {it.variant && <p className="text-[11px] text-ink-400">{it.variant.value}</p>}
                      <p className="text-[11px] text-ink-400">Qty {it.quantity}</p>
                    </div>
                    <p className="text-xs font-semibold">{formatPrice(price * it.quantity)}</p>
                  </div>
                );
              })}
            </div>
            <div className="space-y-2 border-t border-ink-100 px-5 py-4 text-sm dark:border-ink-800">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
              <Row label="Tax (8%)" value={formatPrice(tax)} />
              <div className="border-t border-ink-100 pt-2 dark:border-ink-800">
                <Row label="Total" value={formatPrice(total)} bold />
              </div>
            </div>
            <div className="px-5 pb-5">
              <button type="submit" disabled={placing} className="btn-primary w-full">
                {placing ? <Spinner size={18} /> : <>Place order <ArrowRight size={16} /></>}
              </button>
              <p className="mt-2 text-center text-[11px] text-ink-400">By placing your order, you agree to our terms.</p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={classNames('flex items-center justify-between', bold && 'text-base font-semibold')}>
      <span className={bold ? '' : 'text-ink-500 dark:text-ink-400'}>{label}</span>
      <span>{value}</span>
    </div>
  );
}
