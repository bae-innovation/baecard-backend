import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type FeatureComingSoonProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  ctaLabel?: string;
  onCta?: () => void;
};

export function FeatureComingSoon({
  title,
  description = 'This feature is currently under development and will be available soon.',
  icon,
  ctaLabel,
  onCta,
}: FeatureComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      {icon && (
        <div className="mb-6 flex items-center justify-center">{icon}</div>
      )}
      <h1 className="mb-4 text-3xl font-bold tracking-tight">{title}</h1>
      <p className="mb-8 max-w-2xl text-center text-muted-foreground">
        {description}
      </p>
      <div className="rounded-lg border bg-card p-6 text-center shadow-sm">
        <p className="mb-4 text-sm font-medium text-muted-foreground">
          Coming Soon
        </p>
        {ctaLabel && onCta && (
          <Button onClick={onCta} variant="outline">
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
