import React from 'react';
import { cn } from '../../lib/utils';

export const Button = React.forwardRef(
  ({ className, variant = 'secondary', size = 'md', type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer shrink-0 rounded-xl',
          {
            'bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700 shadow-sm shadow-blue-600/25': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70': variant === 'secondary',
            'border border-border/80 bg-background/80 hover:bg-accent hover:text-accent-foreground active:bg-accent/80': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-red-600 text-white hover:bg-red-500 active:bg-red-700 shadow-sm shadow-red-600/20': variant === 'destructive',
            'bg-[#cff245] text-[#0d0e11] hover:bg-[#bfe033] active:bg-[#afd020] font-semibold shadow-sm shadow-[#cff245]/20': variant === 'lime',
            'h-8 px-3 text-xs sm:text-sm gap-1.5': size === 'sm',
            'h-9.5 px-3.5 text-sm gap-2': size === 'md',
            'h-11 px-5 text-base gap-2.5': size === 'lg',
            'h-8.5 w-8.5 p-0': size === 'icon',
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
          'flex h-9.5 w-full rounded-xl border border-input bg-background/90 px-3.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50',
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
          'flex min-h-[88px] w-full rounded-xl border border-input bg-background/90 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground shadow-2xs transition-colors focus-visible:outline-none focus-visible:ring-1.5 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 font-sans resize-y',
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
        'inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-medium tracking-tight transition-colors shrink-0',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border text-foreground': variant === 'outline',
          'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 font-semibold': variant === 'blue',
          'pl-2 gap-1.5 text-muted-foreground before:content-[""] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-current before:opacity-60': variant === 'dot',
        },
        className
      )}
    >
      {children}
    </span>
  );
};
