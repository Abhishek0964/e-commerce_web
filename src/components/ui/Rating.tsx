import { Star } from 'lucide-react';
import { classNames } from '../../lib/format';

type Size = 'sm' | 'md' | 'lg';

const SIZES: Record<Size, { star: number; text: string }> = {
  sm: { star: 12, text: 'text-xs' },
  md: { star: 16, text: 'text-sm' },
  lg: { star: 20, text: 'text-base' },
};

export function Rating({
  value,
  count,
  size = 'md',
  showValue = true,
  className,
}: {
  value: number;
  count?: number;
  size?: Size;
  showValue?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const rounded = Math.round(value * 2) / 2;
  return (
    <div className={classNames('flex items-center gap-1.5', className)}>
      <div className="flex items-center" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = rounded >= i ? 'full' : rounded >= i - 0.5 ? 'half' : 'empty';
          return (
            <span key={i} className="relative inline-block" style={{ width: s.star, height: s.star }}>
              <Star size={s.star} className="absolute inset-0 text-ink-300 dark:text-ink-600" strokeWidth={1.5} />
              {fill !== 'empty' && (
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: fill === 'half' ? '50%' : '100%' }}
                >
                  <Star size={s.star} className="text-accent-500 fill-accent-500" strokeWidth={1.5} />
                </span>
              )}
            </span>
          );
        })}
      </div>
      {showValue && (
        <span className={classNames('font-medium text-ink-700 dark:text-ink-300', s.text)}>
          {value.toFixed(1)}
        </span>
      )}
      {typeof count === 'number' && (
        <span className={classNames('text-ink-400 dark:text-ink-500', s.text)}>({count})</span>
      )}
    </div>
  );
}
