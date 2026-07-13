import { Link, useLocation, Navigate } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight, Truck } from 'lucide-react';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { formatPrice, formatDate } from '../lib/format';
import type { Order } from '../types';

export function OrderConfirmationPage() {
  const location = useLocation();
  const order = (location.state as { order?: Order; email?: string } | null)?.order;

  useDocumentTitle(order ? `Order ${order.order_number}` : 'Order confirmed');

  if (!order) return <Navigate to="/shop" replace />;

  return (
    <div className="container-page flex flex-col items-center py-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-success-500/10 text-success-500 animate-scale-in">
        <CheckCircle2 size={40} />
      </div>
      <h1 className="mt-6 text-h1 font-display font-semibold">Order confirmed</h1>
      <p className="mt-2 max-w-md text-ink-500 dark:text-ink-400">
        Thank you for your order. A confirmation has been sent to your email.
      </p>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-ink-200 p-6 text-left dark:border-ink-800">
        <div className="flex items-center justify-between border-b border-ink-100 pb-4 dark:border-ink-800">
          <div>
            <p className="text-xs text-ink-400">Order number</p>
            <p className="text-sm font-semibold">{order.order_number}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-400">Placed</p>
            <p className="text-sm font-medium">{formatDate(order.created_at)}</p>
          </div>
        </div>
        <div className="space-y-3 py-4">
          {order.order_items?.map((it) => (
            <div key={it.id} className="flex items-center gap-3">
              <img src={it.image_url ?? ''} alt={it.title} className="h-12 w-10 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{it.title}</p>
                <p className="text-xs text-ink-400">Qty {it.quantity}</p>
              </div>
              <p className="text-sm font-semibold">{formatPrice(Number(it.unit_price) * it.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-ink-100 pt-4 dark:border-ink-800">
          <div className="flex items-center justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl bg-ink-100 p-4 text-sm dark:bg-ink-800">
        <Truck size={20} className="shrink-0 text-accent-500" />
        <p className="text-left text-ink-600 dark:text-ink-300">Estimated delivery in 3-5 business days. Track your order anytime from your account.</p>
      </div>

      <div className="mt-8 flex gap-3">
        <Link to="/account?tab=orders" className="btn-secondary flex items-center gap-1.5"><Package size={16} /> View orders</Link>
        <Link to="/shop" className="btn-primary flex items-center gap-1.5">Continue shopping <ArrowRight size={16} /></Link>
      </div>
    </div>
  );
}
