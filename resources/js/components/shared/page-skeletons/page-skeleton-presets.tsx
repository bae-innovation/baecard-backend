import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

import { PageSkeletonShell } from './page-skeleton-shell';
import { SkeletonDataTable } from './skeleton-data-table';
import { SkeletonDetailSections } from './skeleton-detail-sections';
import { SkeletonFormPage } from './skeleton-form-page';
import { SkeletonPageHeader } from './skeleton-page-header';

type TableListPageSkeletonProps = {
  title?: boolean;
  action?: boolean;
  columns?: number;
  rows?: number;
  filterCount?: number;
  padded?: boolean;
  className?: string;
};

/** Generic list page: header + data table. Use for Phase 2 route migrations. */
export function TableListPageSkeleton({
  action = true,
  columns = 6,
  rows = 8,
  filterCount = 3,
  padded = false,
  className,
}: TableListPageSkeletonProps) {
  return (
    <PageSkeletonShell padded={padded} className={className}>
      <div className="shrink-0">
        <SkeletonPageHeader action={action} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <SkeletonDataTable
          columns={columns}
          rows={rows}
          filterCount={filterCount}
        />
      </div>
    </PageSkeletonShell>
  );
}

type FormPageSkeletonProps = {
  subtitle?: boolean;
  backButton?: boolean;
  cards?: number;
  padded?: boolean;
  className?: string;
};

/** Generic create/edit form page. Use for Phase 2 route migrations. */
export function FormPageSkeleton(props: FormPageSkeletonProps) {
  return <SkeletonFormPage {...props} />;
}

type DetailPageSkeletonProps = {
  sections?: number;
  columnsPerSection?: number;
  className?: string;
};

/** Generic detail/show page. Use for Phase 2 route migrations. */
export function DetailPageSkeleton(props: DetailPageSkeletonProps) {
  return <SkeletonDetailSections {...props} />;
}

/** Compact table skeleton for dialogs and panels */
export function SkeletonDialogTable({
  rows = 4,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2 px-2 py-1', className)}>
      <div className="flex gap-3 border-b px-2 pb-2">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-3 px-2 py-2">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-5 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

type TabbedContentPageSkeletonProps = {
  tabCount?: number;
  statCards?: number;
  className?: string;
};

/** Tabbed CMS-style pages (contents page editors). */
export function TabbedContentPageSkeleton({
  tabCount = 4,
  statCards = 3,
  className,
}: TabbedContentPageSkeletonProps) {
  return (
    <PageSkeletonShell className={className}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 shrink-0 rounded-md" />
        <Skeleton className="size-10 shrink-0 rounded-md" />
        <Skeleton className="h-9 w-52 max-w-full" />
      </div>
      <div
        className={cn(
          'grid h-auto w-full gap-1',
          tabCount <= 4
            ? 'grid-cols-2 sm:grid-cols-4'
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
        )}
      >
        {Array.from({ length: tabCount }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>
      <div
        className={cn(
          'grid gap-4',
          statCards === 4
            ? 'md:grid-cols-2 lg:grid-cols-4'
            : 'md:grid-cols-2 lg:grid-cols-3',
        )}
      >
        {Array.from({ length: statCards }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-lg border bg-card p-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4 rounded-lg border bg-card p-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="aspect-video w-full rounded-md" />
            <Skeleton className="aspect-video w-full rounded-md" />
          </div>
        </div>
        <div className="space-y-3 rounded-lg border bg-card p-6">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </PageSkeletonShell>
  );
}

/** Two-column card grid for dialog detail panels */
export function SkeletonDialogCardGrid({
  cards = 4,
  className,
}: {
  cards?: number;
  className?: string;
}) {
  return (
    <div
      className={cn('grid gap-4 p-4 sm:grid-cols-2', className)}
      aria-busy="true"
    >
      {Array.from({ length: cards }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border p-4">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
