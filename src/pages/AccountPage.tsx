import { useEffect, useState } from 'react';
import { Link, useSearchParams, Navigate } from 'react-router-dom';
import {
  Package, Heart, MapPin, User as UserIcon, LogOut, Settings, Plus, Trash2, Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { fetchOrders, fetchAddresses, saveAddress, deleteAddress } from '../lib/queries';
import { ProductCard } from '../components/ProductCard';
import { Spinner } from '../components/ui/Spinner';
import { formatPrice, formatDate, classNames } from '../lib/format';
import { useToast } from '../components/ui/Toast';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import type { Order, Address } from '../types';

const TABS = [
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'profile', label: 'Profile', icon: UserIcon },
] as const;

type TabKey = typeof TABS[number]['key'];

export function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) ?? 'orders';

  useDocumentTitle('My account');

  if (loading) {
    return <div className="container-page flex justify-center py-32"><Spinner size={28} /></div>;
  }
  if (!user) return <Navigate to="/signin" state={{ from: '/account' }} replace />;

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-display font-semibold">My account</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{user.email}</p>
        </div>
        <button onClick={signOut} className="btn-ghost flex items-center gap-1.5"><LogOut size={16} /> Sign out</button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="flex gap-1 overflow-x-auto lg:flex-col">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setParams({ tab: t.key })}
              className={classNames(
                'flex shrink-0 items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium transition',
                tab === t.key
                  ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-900'
                  : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800',
              )}
            >
              <t.icon size={17} /> {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'orders' && <OrdersTab />}
          {tab === 'wishlist' && <WishlistTab />}
          {tab === 'addresses' && <AddressesTab />}
          {tab === 'profile' && <ProfileTab />}
        </div>
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders().then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-16"><Spinner size={24} /></div>;
  if (orders.length === 0) {
    return (
      <EmptyTab
        icon={<Package size={28} />}
        title="No orders yet"
        desc="When you place an order, it'll appear here."
        action={<Link to="/shop" className="btn-primary">Start shopping</Link>}
      />
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4 dark:border-ink-800">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{o.order_number}</p>
              <p className="text-xs text-ink-400">{formatDate(o.created_at)}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="chip bg-success-500/10 capitalize text-success-600 dark:text-success-500">{o.status}</span>
              <span className="text-sm font-semibold">{formatPrice(Number(o.total))}</span>
            </div>
          </div>
          <div className="divide-y divide-ink-100 dark:divide-ink-800">
            {o.order_items?.map((it) => (
              <div key={it.id} className="flex items-center gap-4 px-5 py-3">
                <img src={it.image_url ?? ''} alt={it.title} className="h-14 w-12 rounded-lg object-cover" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.title}</p>
                  {it.variant_name && <p className="text-xs text-ink-400">{it.variant_name}</p>}
                  <p className="text-xs text-ink-400">Qty {it.quantity}</p>
                </div>
                <p className="text-sm font-medium">{formatPrice(Number(it.unit_price) * it.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function WishlistTab() {
  const { products, loading } = useWishlist();

  if (loading) return <div className="flex justify-center py-16"><Spinner size={24} /></div>;
  if (products.length === 0) {
    return (
      <EmptyTab
        icon={<Heart size={28} />}
        title="Your wishlist is empty"
        desc="Save items you love to find them quickly later."
        action={<Link to="/shop" className="btn-primary">Discover products</Link>}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
      {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
    </div>
  );
}

function AddressesTab() {
  const { push } = useToast();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Address> | null>(null);

  const load = () => {
    fetchAddresses().then(setAddresses).catch(() => setAddresses([])).finally(() => setLoading(false));
  };
  useEffect(load, []);

  if (loading) return <div className="flex justify-center py-16"><Spinner size={24} /></div>;

  if (editing) {
    return (
      <AddressForm
        initial={editing}
        onCancel={() => setEditing(null)}
        onSaved={() => { setEditing(null); load(); push(editing.id ? 'Address updated' : 'Address added', 'success'); }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={() => setEditing({ label: 'Home', country: 'India' })} className="btn-secondary flex items-center gap-1.5"><Plus size={16} /> Add address</button>
      {addresses.length === 0 ? (
        <EmptyTab icon={<MapPin size={28} />} title="No saved addresses" desc="Add an address for faster checkout." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{a.label}</p>
                    {a.is_default && <span className="chip bg-accent-500/10 text-accent-700 dark:text-accent-400">Default</span>}
                  </div>
                  <p className="mt-2 text-sm text-ink-600 dark:text-ink-300">{a.full_name}</p>
                  <p className="text-sm text-ink-600 dark:text-ink-300">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                  <p className="text-sm text-ink-600 dark:text-ink-300">{a.city}, {a.state} {a.postal_code}</p>
                  <p className="text-sm text-ink-600 dark:text-ink-300">{a.country}</p>
                  {a.phone && <p className="mt-1 text-sm text-ink-400">{a.phone}</p>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(a)} className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Edit address"><Settings size={15} /></button>
                  <button onClick={async () => { await deleteAddress(a.id); load(); push('Address removed', 'info'); }} className="grid h-8 w-8 place-items-center rounded-lg text-ink-400 hover:bg-error-500/10 hover:text-error-500" aria-label="Delete address"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ initial, onCancel, onSaved }: { initial: Partial<Address>; onCancel: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Address>>(initial);
  const [saving, setSaving] = useState(false);

  const update = (k: keyof Address, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveAddress(form);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      <h2 className="text-base font-semibold">{initial.id ? 'Edit address' : 'Add address'}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Label" value={form.label ?? ''} onChange={(v) => update('label', v)} placeholder="Home" />
        <Input label="Full name" value={form.full_name ?? ''} onChange={(v) => update('full_name', v)} required placeholder="Jane Doe" />
        <Input label="Address line 1" value={form.line1 ?? ''} onChange={(v) => update('line1', v)} required placeholder="123 Main St" className="sm:col-span-2" />
        <Input label="Address line 2" value={form.line2 ?? ''} onChange={(v) => update('line2', v)} placeholder="Apt 4B" className="sm:col-span-2" />
        <Input label="City" value={form.city ?? ''} onChange={(v) => update('city', v)} required />
        <Input label="State / Province" value={form.state ?? ''} onChange={(v) => update('state', v)} required />
        <Input label="Postal code" value={form.postal_code ?? ''} onChange={(v) => update('postal_code', v)} required />
        <Input label="Country" value={form.country ?? ''} onChange={(v) => update('country', v)} required />
        <Input label="Phone" value={form.phone ?? ''} onChange={(v) => update('phone', v)} />
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input type="checkbox" checked={form.is_default ?? false} onChange={(e) => update('is_default', e.target.checked)} className="h-4 w-4 rounded border-ink-300" />
          Set as default
        </label>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Saving…' : 'Save address'}</button>
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
      </div>
    </form>
  );
}

function Input({ label, value, onChange, required, placeholder, className }: { label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; className?: string }) {
  return (
    <label className={classNames('block', className)}>
      <span className="mb-1.5 block text-xs font-medium text-ink-600 dark:text-ink-400">{label}{required && ' *'}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className="input" />
    </label>
  );
}

function ProfileTab() {
  const { user } = useAuth();
  const meta = user?.user_metadata as { full_name?: string } | undefined;
  return (
    <div className="card max-w-lg space-y-5 p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-900 text-xl font-semibold text-white dark:bg-white dark:text-ink-900">
          {(meta?.full_name ?? user?.email ?? '?').charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold">{meta?.full_name ?? 'Member'}</p>
          <p className="text-sm text-ink-500 dark:text-ink-400">{user?.email}</p>
        </div>
      </div>
      <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">Account details</p>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-ink-500">User ID</dt><dd className="font-mono text-xs">{user?.id?.slice(0, 8)}…</dd></div>
          <div className="flex justify-between"><dt className="text-ink-500">Joined</dt><dd>{user?.created_at ? formatDate(user.created_at) : '—'}</dd></div>
          <div className="flex items-center justify-between"><dt className="text-ink-500">Email verified</dt><dd className="flex items-center gap-1 text-success-600"><Check size={15} /> Yes</dd></div>
        </dl>
      </div>
    </div>
  );
}

function EmptyTab({ icon, title, desc, action }: { icon: React.ReactNode; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-ink-100 text-ink-400 dark:bg-ink-800">{icon}</div>
      <div>
        <p className="text-base font-medium text-ink-900 dark:text-ink-100">{title}</p>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{desc}</p>
      </div>
      {action}
    </div>
  );
}
