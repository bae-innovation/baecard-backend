import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { PageSkeletonShell } from './page-skeleton-shell';

type SkeletonDetailSectionsProps = {
  sections?: number;
  columnsPerSection?: number;
  className?: string;
};

export function SkeletonDetailSection({
  columns = 4,
  className,
}: {
  columns?: number;
  className?: string;
}) {
  return (
    <section
      className={cn('overflow-hidden rounded-xl border bg-card p-6', className)}
    >
      <Skeleton className="mb-4 h-5 w-32" />
      <div
        className={cn(
          'grid gap-4',
          columns === 2 && 'sm:grid-cols-2',
          columns === 3 && 'sm:grid-cols-2 lg:grid-cols-3',
          columns >= 4 && 'sm:grid-cols-2 lg:grid-cols-4',
        )}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-6 w-full max-w-[12rem]" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function SkeletonDetailSections({
  sections = 2,
  columnsPerSection = 4,
  className,
}: SkeletonDetailSectionsProps) {
  return (
    <PageSkeletonShell className={cn('gap-8', className)}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-lg" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-10 w-28 rounded-md" />
      </div>
      {Array.from({ length: sections }).map((_, i) => (
        <SkeletonDetailSection key={i} columns={columnsPerSection} />
      ))}
    </PageSkeletonShell>
  );
}
