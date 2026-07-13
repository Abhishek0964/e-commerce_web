import { formatPrice, discountPercent, classNames } from '../../lib/format';

export function Price({
  price,
  compareAt,
  size = 'md',
  className,
}: {
  price: number;
  compareAt?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const discount = discountPercent(price, compareAt);
  const sizes = {
    sm: { price: 'text-sm', compare: 'text-xs' },
    md: { price: 'text-base', compare: 'text-sm' },
    lg: { price: 'text-2xl', compare: 'text-base' },
  };
  const s = sizes[size];
  return (
    <div className={classNames('flex items-baseline gap-2', className)}>
      <span className={classNames('font-semibold text-ink-900 dark:text-ink-100', s.price)}>
        {formatPrice(price)}
      </span>
      {discount && (
        <>
          <span className={classNames('text-ink-400 line-through', s.compare)}>
            {formatPrice(compareAt)}
          </span>
          <span className="chip bg-accent-500/10 text-accent-700 dark:text-accent-400">-{discount}%</span>
        </>
      )}
    </div>
  );
}
