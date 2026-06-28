import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const marketingButtonVariants = cva(
  'fe-touch inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-accent/50 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        outline:
          'rounded-full border-2 border-fe-accent bg-fe-surface/50 text-fe-accent hover:bg-fe-accent hover:text-fe-bg',
        solid: 'rounded-full bg-fe-accent text-fe-bg hover:opacity-90',
        ghost: 'rounded-full text-fe-text hover:text-fe-accent',
      },
      size: {
        default: 'min-h-11 px-6 py-2.5 text-sm',
        sm: 'min-h-10 px-4 py-2 text-xs',
        lg: 'min-h-12 px-8 py-3 text-base sm:text-base',
        icon: 'size-12 min-h-12 min-w-12 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
);

export type MarketingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof marketingButtonVariants>;

export function MarketingButton({
  className,
  variant,
  size,
  ...props
}: MarketingButtonProps) {
  return (
    <button className={cn(marketingButtonVariants({ variant, size }), className)} {...props} />
  );
}
