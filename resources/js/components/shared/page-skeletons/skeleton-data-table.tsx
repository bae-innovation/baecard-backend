import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const DEFAULT_ROWS = 8;
const DEFAULT_COLUMNS = 6;

type SkeletonDataTableProps = {
  columns?: number;
  rows?: number;
  filterCount?: number;
  showViewOptions?: boolean;
  showFilterRow?: boolean;
  className?: string;
};

export function SkeletonDataTable({
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  filterCount = 3,
  showViewOptions = true,
  showFilterRow = false,
  className,
}: SkeletonDataTableProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 min-w-0 flex-1 flex-col gap-3 overflow-hidden',
        className,
      )}
    >
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 pt-0.5">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-44 min-w-[11rem] max-w-sm rounded-md" />
          {Array.from({ length: filterCount }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>
        {showViewOptions ? <Skeleton className="h-8 w-28 rounded-md" /> : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border">
        <div className="border-b bg-muted/30 p-3">
          <div className="flex gap-2">
            {Array.from({ length: columns }).map((_, i) => (
              <Skeleton key={i} className="h-8 flex-1" />
            ))}
          </div>
          {showFilterRow ? (
            <div className="mt-2 flex gap-2">
              {Array.from({ length: columns }).map((_, i) => (
                <Skeleton key={`f-${i}`} className="h-7 flex-1" />
              ))}
            </div>
          ) : null}
        </div>
        <div className="divide-y p-1">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2 px-3 py-3">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn(
                    'h-5 flex-1',
                    colIndex === 0 && 'w-20 flex-none shrink-0',
                    colIndex === columns - 1 && 'w-8 flex-none shrink-0',
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between pt-1">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="size-9 rounded-md" />
          <Skeleton className="size-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}
