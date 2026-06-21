import type { Table } from '@tanstack/react-table';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

function formatRowCountSummary<TData>(
  table: Table<TData>,
  totalRecords?: number,
) {
  const total = totalRecords ?? table.getFilteredRowModel().rows.length;
  if (total === 0) return 'No records';

  const { pageIndex, pageSize } = table.getState().pagination;
  const from = pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, total);
  const label = total === 1 ? 'record' : 'records';

  if (from === to) {
    return `Showing ${from} of ${total.toLocaleString()} ${label}`;
  }
  return `Showing ${from}–${to} of ${total.toLocaleString()} ${label}`;
}

type DataTableFooterProps<TData> = {
  table: Table<TData>;
  className?: string;
  /** When false, hides the rows-per-page selector (e.g. server-driven page size). */
  showPageSizeSelector?: boolean;
  /** When false, hides the “N of M row(s) selected” line (e.g. row selection disabled). */
  showSelectionSummary?: boolean;
  /**
   * When true, shows “Showing X–Y of Z records” on the left.
   * Defaults to on when `showSelectionSummary` is false.
   */
  showRowCountSummary?: boolean;
  /** Server-paginated total (defaults to filtered row model length). */
  totalRecords?: number;
  /**
   * Optional content to the left of the selection summary (same row).
   * Parent should reserve width if needed to avoid layout shift.
   */
  leadingAccessory?: React.ReactNode;
  /** Row count on the left; page label grouped with prev/next on the right. */
  compactLayout?: boolean;
};

export function DataTableFooter<TData>({
  table,
  className,
  showPageSizeSelector = true,
  showSelectionSummary = true,
  showRowCountSummary = !showSelectionSummary,
  totalRecords,
  leadingAccessory,
  compactLayout = false,
}: DataTableFooterProps<TData>) {
  const showLeadingSection =
    showSelectionSummary || showRowCountSummary || leadingAccessory;

  const pageLabel = (
    <p className="text-sm font-medium">
      Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
    </p>
  );

  const paginationButtons = (
    <>
      <Button
        variant="outline"
        size="icon"
        className="size-8 shrink-0"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        <span className="sr-only">Go to first page</span>
        <ChevronsLeft className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-8 shrink-0"
        onClick={() =>
          table.setPageIndex(Math.max(0, table.getPageCount() - 1))
        }
        disabled={!table.getCanNextPage()}
      >
        <span className="sr-only">Go to last page</span>
        <ChevronsRight className="size-4" />
      </Button>
    </>
  );

  if (compactLayout) {
    return (
      <div
        className={cn(
          'flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4',
          className,
        )}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          {leadingAccessory ? (
            <div className="shrink-0">{leadingAccessory}</div>
          ) : null}
          {showSelectionSummary ? (
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          ) : null}
          {showRowCountSummary && !showSelectionSummary ? (
            <p className="text-sm text-muted-foreground">
              {formatRowCountSummary(table, totalRecords)}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {showPageSizeSelector ? (
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {pageLabel}
          {paginationButtons}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-4 py-4', className)}>
      {showLeadingSection ? (
        <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1">
          {leadingAccessory ? (
            <div className="shrink-0">{leadingAccessory}</div>
          ) : null}
          {showSelectionSummary ? (
            <div className="text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
          ) : null}
          {showRowCountSummary && !showSelectionSummary ? (
            <p className="text-sm text-muted-foreground">
              {formatRowCountSummary(table, totalRecords)}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {showPageSizeSelector ? (
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          {pageLabel}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {paginationButtons}
        </div>
      </div>
    </div>
  );
}
