import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { PageSkeletonShell } from './page-skeleton-shell';

type SkeletonFormCardProps = {
  className?: string;
  fields?: number;
  tall?: boolean;
};

export function SkeletonFormCard({
  className,
  fields = 3,
  tall = false,
}: SkeletonFormCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-6 shadow-sm', className)}>
      <Skeleton className="mb-6 h-6 w-40" />
      <div className="space-y-4">
        {Array.from({ length: fields }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
        {tall ? <Skeleton className="h-32 w-full" /> : null}
      </div>
    </div>
  );
}

type SkeletonFormPageProps = {
  subtitle?: boolean;
  backButton?: boolean;
  cards?: number;
  className?: string;
  shellClassName?: string;
  padded?: boolean;
};

export function SkeletonFormPage({
  subtitle = true,
  backButton = false,
  cards = 1,
  className,
  shellClassName,
  padded = false,
}: SkeletonFormPageProps) {
  return (
    <PageSkeletonShell
      padded={padded}
      className={cn('gap-4 py-4', shellClassName)}
    >
      <div className={cn('shrink-0', className)}>
        {backButton ? (
          <div className="mb-6 flex items-center gap-4">
            <Skeleton className="size-9 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              {subtitle ? <Skeleton className="h-4 w-72" /> : null}
            </div>
          </div>
        ) : (
          <div className="mb-6 space-y-2">
            <Skeleton className="h-8 w-56" />
            {subtitle ? <Skeleton className="h-4 w-80 max-w-full" /> : null}
          </div>
        )}
      </div>
      {Array.from({ length: cards }).map((_, i) => (
        <SkeletonFormCard key={i} tall={i === 0 && cards === 1} />
      ))}
    </PageSkeletonShell>
  );
}
