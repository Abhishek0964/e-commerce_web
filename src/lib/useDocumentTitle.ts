import { useEffect } from 'react';

const DEFAULT_TITLE = 'Maison — Considered Goods, Delivered';
const DEFAULT_DESC =
  'A curated marketplace for premium apparel, footwear, electronics, and home goods. Premium products, fast shipping, easy returns.';

export function useDocumentTitle(title?: string, description?: string): void {
  useEffect(() => {
    document.title = title ? `${title} | Maison` : DEFAULT_TITLE;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description ?? DEFAULT_DESC);
    const og = document.querySelector('meta[property="og:title"]');
    if (og) og.setAttribute('content', title ? `${title} | Maison` : DEFAULT_TITLE);
  }, [title, description]);
}
