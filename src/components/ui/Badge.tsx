import { classNames } from '../../lib/format';

export function Badge({
  children,
  variant = 'neutral',
  className,
}: {
  children: React.ReactNode;
  variant?: 'neutral' | 'accent' | 'success' | 'error' | 'dark';
  className?: string;
}) {
  const variants: Record<string, string> = {
    neutral: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-300',
    accent: 'bg-accent-500/10 text-accent-700 dark:text-accent-400',
    success: 'bg-success-500/10 text-success-600 dark:text-success-500',
    error: 'bg-error-500/10 text-error-600 dark:text-error-500',
    dark: 'bg-ink-900 text-white dark:bg-white dark:text-ink-900',
  };
  return <span className={classNames('chip', variants[variant], className)}>{children}</span>;
}
