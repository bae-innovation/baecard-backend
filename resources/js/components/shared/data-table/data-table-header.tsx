import { flexRender, type Table } from '@tanstack/react-table';
import * as React from 'react';

import { DataTableColumnDateFilter } from '@/components/shared/data-table/data-table-column-date-filter';
import { DataTableColumnDateRangeFilter } from '@/components/shared/data-table/data-table-column-date-range-filter';
import {
  DATA_TABLE_HEADER_CELL_CLASS,
  DATA_TABLE_HEADER_TITLE_CLASS,
} from '@/components/shared/data-table/data-table-constants';
import { getDataTableStickyColumnCellClassName } from '@/components/shared/data-table/data-table-sticky-columns';
import { Input } from '@/components/ui/input';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type DataTableColumnMeta = {
  className?: string;
  /** Pin column on horizontal scroll (`actions` defaults to `right`). */
  pin?: 'left' | 'right';
  /** Skip automatic sticky pin (column supplies its own `meta.className`). */
  disableStickyPin?: boolean;
  /** When true, the per-column text filter row is omitted (e.g. faceted-only columns). */
  hideFilterInput?: boolean;
  /** Renders a calendar filter instead of a text input (column must allow filtering). */
  filterVariant?: 'date' | 'dateRange';
  /** Actions column width: `compact` for ⋯ menu, `wide` for inline buttons. */
  actionsLayout?: 'compact' | 'wide';
};

export type DataTableColumnHeaderProps<TData> = {
  table: Table<TData>;
  /** When false, the per-column filter input row is hidden (server-side filters only). */
  showFilterRow?: boolean;
  /** Sticky first header row (horizontal scroll + vertical scroll), e.g. salary list tables. */
  stickyTopHeader?: boolean;
  /** Extra classes for stacking when `stickyTopHeader` is true (e.g. z-index per column). */
  stickyTopHeaderCellClassName?: (
    columnId: string,
    layer: 'title' | 'filter',
  ) => string | undefined;
  /** `top-*` offset for the filter row when both sticky header and filter row are used. */
  stickyFilterRowTopClassName?: string;
  /** Tighter vertical spacing between title and filter rows (orders list). */
  compactFilterHeader?: boolean;
};

export function DataTableHeader<TData>({
  table,
  showFilterRow = false,
  stickyTopHeader = true,
  stickyTopHeaderCellClassName,
  stickyFilterRowTopClassName,
  compactFilterHeader = true,
}: DataTableColumnHeaderProps<TData>) {
  const resolvedFilterRowTop =
    stickyFilterRowTopClassName ??
    (compactFilterHeader ? 'top-[calc(2.5rem+1px)]' : 'top-[3.5rem]');

  return (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <React.Fragment key={headerGroup.id}>
          <TableRow>
            {headerGroup.headers.map((header) => {
              const meta = header.column.columnDef.meta as
                | DataTableColumnMeta
                | undefined;
              const colId = header.column.id;
              const stickyPinClassName = getDataTableStickyColumnCellClassName(
                colId,
                meta,
                'header',
              );
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    meta?.className,
                    stickyPinClassName,
                    DATA_TABLE_HEADER_CELL_CLASS,
                    DATA_TABLE_HEADER_TITLE_CLASS,
                    'whitespace-nowrap',
                    stickyTopHeader && 'sticky top-0 border-b',
                    stickyTopHeader &&
                      stickyTopHeaderCellClassName?.(colId, 'title'),
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
          </TableRow>
          {showFilterRow ? (
            <TableRow>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | DataTableColumnMeta
                  | undefined;
                const colId = header.column.id;
                const canFilter = header.column.getCanFilter();
                const showDate =
                  canFilter &&
                  !meta?.hideFilterInput &&
                  meta?.filterVariant === 'date';
                const showDateRange =
                  canFilter &&
                  !meta?.hideFilterInput &&
                  meta?.filterVariant === 'dateRange';
                const showText =
                  canFilter &&
                  !meta?.hideFilterInput &&
                  meta?.filterVariant !== 'date' &&
                  meta?.filterVariant !== 'dateRange';
                const isCentered = meta?.className?.includes('text-center');
                const stickyPinClassName =
                  getDataTableStickyColumnCellClassName(colId, meta, 'header');

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      meta?.className,
                      stickyPinClassName,
                      DATA_TABLE_HEADER_CELL_CLASS,
                      stickyTopHeader &&
                        cn('sticky border-b', resolvedFilterRowTop),
                      stickyTopHeader &&
                        stickyTopHeaderCellClassName?.(colId, 'filter'),
                    )}
                  >
                    {showDate ? (
                      <DataTableColumnDateFilter column={header.column} />
                    ) : showDateRange ? (
                      <DataTableColumnDateRangeFilter column={header.column} />
                    ) : showText ? (
                      <Input
                        placeholder=""
                        aria-label={`Filter ${header.column.id}`}
                        value={
                          (header.column.getFilterValue() ?? '') as string
                        }
                        onChange={(event) =>
                          header.column.setFilterValue(event.target.value)
                        }
                        className={cn(
                          'h-8 w-full max-w-[150px]',
                          isCentered && 'mx-auto',
                        )}
                      />
                    ) : null}
                  </TableHead>
                );
              })}
            </TableRow>
          ) : null}
        </React.Fragment>
      ))}
    </TableHeader>
  );
}
