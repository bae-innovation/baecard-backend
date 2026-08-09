import type { ComponentType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  highlight?: boolean;
  destructive?: boolean;
  description?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  highlight,
  destructive,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={cn(
          'text-2xl font-semibold tabular-nums tracking-tight',
          highlight && 'text-primary',
          destructive && 'text-destructive',
        )}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
