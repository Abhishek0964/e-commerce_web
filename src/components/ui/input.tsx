import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const cn = (...classes: (string | undefined | null | false)[]) => classes.filter(Boolean).join(' ');

const inputVariants = cva(
    'flex w-full rounded-md border bg-background px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            state: {
                default: 'border-input',
                error: 'border-destructive focus-visible:ring-destructive',
                success: 'border-green-500 focus-visible:ring-green-500',
            },
        },
        defaultVariants: {
            state: 'default',
        },
    }
);

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
    error?: string;
    helperText?: string;
    label?: string;
    icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, state, type, error, helperText, label, icon, id, ...props }, ref) => {
        const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
        const errorId = `${inputId}-error`;
        const helperId = `${inputId}-helper`;
        const actualState = error ? 'error' : state;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}
                    <input
                        id={inputId}
                        type={type}
                        className={cn(
                            inputVariants({ state: actualState }),
                            icon ? 'pl-10' : '',
                            className
                        )}
                        ref={ref}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : helperText ? helperId : undefined}
                        {...props}
                    />
                </div>
                {error && (
                    <p id={errorId} className="mt-1.5 text-sm text-destructive" role="alert">
                        {error}
                    </p>
                )}
                {!error && helperText && (
                    <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input, inputVariants };
