import * as React from 'react';

import { cn } from '@/lib/utils';

type MarketingCardProps = React.HTMLAttributes<HTMLDivElement> & {
  glow?: boolean;
};

export function MarketingCard({ className, glow, children, ...props }: MarketingCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-fe-border bg-fe-surface/80 p-6 text-fe-text backdrop-blur-sm transition-all',
        glow && 'hover:shadow-[0_0_24px_rgba(102,252,241,0.25)] hover:ring-2 hover:ring-fe-accent/60',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
