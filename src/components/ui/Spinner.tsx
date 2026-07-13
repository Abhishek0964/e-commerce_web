import { Loader2 } from 'lucide-react';
import { classNames } from '../../lib/format';

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return (
    <Loader2
      size={size}
      className={classNames('animate-spin text-ink-400', className)}
      aria-hidden
    />
  );
}

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24" role="status">
      <Spinner size={28} />
      <p className="text-sm text-ink-500 dark:text-ink-400">{label}…</p>
    </div>
  );
}
