import * as React from 'react';
import Link from 'next/link';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
    };
    className?: string;
}

function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center',
                className
            )}
        >
            {icon && (
                <div className="mb-4 text-muted-foreground opacity-50">{icon}</div>
            )}
            <h2 className="mb-2 text-2xl font-semibold">{title}</h2>
            {description && (
                <p className="mb-6 text-muted-foreground">{description}</p>
            )}
            {action && (
                <Link
                    href={action.href}
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                    {action.label}
                </Link>
            )}
        </div>
    );
}

export { EmptyState };
