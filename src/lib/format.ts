export const CURRENCY = 'INR';

export function formatPrice(value: number | null | undefined, currency = CURRENCY): string {
  const n = typeof value === 'number' && !Number.isNaN(value) ? value : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function discountPercent(price: number, compareAt: number | null | undefined): number | null {
  if (!compareAt || compareAt <= price || compareAt <= 0) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `MA-${year}-${rand}`;
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}\u2026`;
}

const TAG_LABELS: Record<string, string> = {
  new: 'New',
  bestseller: 'Bestseller',
  luxury: 'Luxury',
};

export function tagLabel(tag: string): string {
  return TAG_LABELS[tag] ?? tag;
}
