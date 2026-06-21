import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const spinnerVariants = cva('flex-col items-center justify-center', {
  variants: {
    show: {
      true: 'flex',
      false: 'hidden',
    },
  },
  defaultVariants: {
    show: true,
  },
});

const loaderVariants = cva('animate-spin text-primary', {
  variants: {
    size: {
      small: 'size-6',
      medium: 'size-8',
      large: 'size-12',
    },
  },
  defaultVariants: {
    size: 'medium',
  },
});

type SpinnerContentProps = VariantProps<typeof spinnerVariants> &
  VariantProps<typeof loaderVariants> & {
    className?: string;
    children?: React.ReactNode;
  };

export function Loading({
  size,
  show,
  children,
  className,
}: SpinnerContentProps) {
  return (
    <div
      className={cn(
        spinnerVariants({ show }),
        'fixed inset-0 items-center justify-center bg-background/50 backdrop-blur-sm',
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute size-16 animate-ping rounded-full bg-primary/10"></div>
        <div className="absolute size-16 animate-pulse rounded-full bg-primary/30"></div>
        <Loader2
          className={cn(
            loaderVariants({ size }),
            'animate-spin text-primary',
            className,
          )}
        />
        {children}
      </div>
    </div>
  );
}
