import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { useDocumentTitle } from '../lib/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Page not found');
  return (
    <div className="container-page flex flex-col items-center justify-center py-32 text-center">
      <p className="font-display text-7xl font-semibold text-ink-200 dark:text-ink-800">404</p>
      <h1 className="mt-4 text-h2 font-display font-semibold">Page not found</h1>
      <p className="mt-2 max-w-sm text-ink-500 dark:text-ink-400">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link to="/" className="btn-primary flex items-center gap-1.5"><Home size={16} /> Go home</Link>
        <Link to="/shop" className="btn-secondary flex items-center gap-1.5"><ArrowLeft size={16} /> Browse shop</Link>
      </div>
    </div>
  );
}
