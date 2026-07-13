import { Link } from 'react-router-dom';
import { Truck, ShieldCheck, RotateCcw, Sparkles, Instagram, Twitter, Github } from 'lucide-react';

const TRUST = [
  { icon: Truck, title: 'Free shipping', desc: 'On orders over ₹1,500' },
  { icon: RotateCcw, title: '30-day returns', desc: 'No-questions-asked' },
  { icon: ShieldCheck, title: 'Secure checkout', desc: 'Encrypted & protected' },
  { icon: Sparkles, title: 'Curated quality', desc: 'Only the best makes it' },
];

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/shop?tags=new' },
      { label: 'Bestsellers', to: '/shop?tags=bestseller' },
      { label: 'Apparel', to: '/shop?category=apparel' },
      { label: 'Footwear', to: '/shop?category=footwear' },
      { label: 'Electronics', to: '/shop?category=electronics' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Shipping', to: '/shop' },
      { label: 'Returns', to: '/shop' },
      { label: 'Track Order', to: '/account?tab=orders' },
      { label: 'Contact', to: '/shop' },
      { label: 'FAQs', to: '/shop' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/shop' },
      { label: 'Sustainability', to: '/shop' },
      { label: 'Careers', to: '/shop' },
      { label: 'Press', to: '/shop' },
      { label: 'Privacy', to: '/shop' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-200 bg-white dark:border-ink-800 dark:bg-ink-950">
      <div className="border-b border-ink-200 dark:border-ink-800">
        <div className="container-page grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {TRUST.map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300">
                <t.icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{t.title}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-5">
        <div className="col-span-2">
          <Link to="/" className="font-display text-2xl font-semibold tracking-tight">Maison</Link>
          <p className="mt-3 max-w-sm text-sm text-ink-500 dark:text-ink-400">
            A curated marketplace for considered apparel, footwear, electronics, and home goods. Premium products, shipped fast, made to last.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Twitter, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-ink-900 hover:text-ink-900 dark:border-ink-700 dark:hover:border-white dark:hover:text-white"
                aria-label="Social link"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-ink-400">{col.title}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-ink-600 transition hover:text-ink-900 dark:text-ink-400 dark:hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-ink-200 dark:border-ink-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-ink-400 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Maison. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Crafted with care</span>
            <span aria-hidden>·</span>
            <span>VISA · Mastercard · AMEX · PayPal</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
