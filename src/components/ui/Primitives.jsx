import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'secondary', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer shrink-0 rounded-lg',
          {
            'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-xs': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70': variant === 'secondary',
            'border border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground active:bg-accent/80': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-xs': variant === 'destructive',
            'h-7 px-2.5 text-xs gap-1': size === 'sm',
            'h-8.5 px-3 text-xs gap-1.5': size === 'md',
            'h-10 px-4 text-sm gap-2': size === 'lg',
            'h-7.5 w-7.5 p-0': size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export const Input = React.forwardRef(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-8.5 w-full rounded-lg border border-input bg-background/90 px-3 py-1 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export const Textarea = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'flex min-h-[76px] w-full rounded-lg border border-input bg-background/90 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-sans resize-y',
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export const Badge = ({
  className,
  variant = 'default',
  children,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium tracking-tight transition-colors shrink-0',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border text-foreground': variant === 'outline',
          'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold': variant === 'blue',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
