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
    <div className="owner-card flex items-center justify-between gap-3 py-3">
      <p className="owner-muted font-medium">{summary}</p>
      {last_page > 1 ? (
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="owner-search-refresh"
            disabled={current_page <= 1}
            onClick={() => onPageChange(current_page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="owner-icon-inline !mr-0" />
          </Button>
          <span className="owner-muted min-w-[4.5rem] text-center font-semibold tabular-nums">
            {current_page} / {last_page}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="owner-search-refresh"
            disabled={current_page >= last_page}
            onClick={() => onPageChange(current_page + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="owner-icon-inline !mr-0" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
