import * as React from 'react';

import { cn } from '@/lib/utils';

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    color?: string;
  }
>;

type ChartContainerProps = React.ComponentProps<'div'> & {
  config: ChartConfig;
};

export function ChartContainer({
  children,
  className,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn(
        'flex aspect-video items-center justify-center rounded-lg border border-dashed bg-muted/30 text-sm text-muted-foreground',
        className,
      )}
      {...props}
    >
      Chart placeholder
      <div className="hidden">{children}</div>
    </div>
  );
}

export function ChartTooltipContent() {
  return null;
}

export function ChartLegendContent() {
  return null;
}

export function ChartStyle() {
  return null;
}
