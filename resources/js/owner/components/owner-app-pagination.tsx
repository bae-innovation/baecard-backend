import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import type { LaravelPaginator } from '@/types/inertia';

type OwnerAppPaginationProps<T> = {
  paginator: LaravelPaginator<T>;
  onPageChange: (page: number) => void;
};

export function OwnerAppPagination<T>({
  paginator,
  onPageChange,
}: OwnerAppPaginationProps<T>) {
  const { current_page, last_page, total, from, to } = paginator;

  if (last_page <= 1 && total === 0) {
    return null;
  }

  const summary =
    total === 0
      ? 'No records'
      : from != null && to != null
        ? `${from}–${to} of ${total}`
        : `${total} records`;

  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{summary}</p>
      {last_page > 1 ? (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={current_page <= 1}
            onClick={() => onPageChange(current_page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="min-w-[4rem] text-center text-xs font-medium tabular-nums">
            {current_page} / {last_page}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            disabled={current_page >= last_page}
            onClick={() => onPageChange(current_page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
