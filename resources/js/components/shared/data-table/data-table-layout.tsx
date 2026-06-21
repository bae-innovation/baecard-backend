import type { Table as TanstackTable } from '@tanstack/react-table';
import * as React from 'react';

import { DataTableBody } from '@/components/shared/data-table/data-table-body';
import {
  DATA_TABLE_SCROLL_CONTAINER_CLASS,
  DATA_TABLE_STICKY_FILTER_ROW_TOP,
} from '@/components/shared/data-table/data-table-constants';
import {
  DataTableHeader,
  type DataTableColumnHeaderProps,
} from '@/components/shared/data-table/data-table-header';
import { mergeDataTableStickyHeaderCellClassName } from '@/components/shared/data-table/data-table-sticky-columns';
import { Table } from '@/components/ui/table';
import { useNestedScrollChain } from '@/hooks/use-nested-scroll-chain';
import { composeRefs } from '@/lib/compose-refs';
import { cn } from '@/lib/utils';

export type DataTableLayoutProps<TData> = {
  table: TanstackTable<TData>;
  colSpan: number;
  /** Toolbar row (filters, period pickers, export) — sticks above the scrolling table. */
  toolbar?: React.ReactNode;
  /** Pagination / summary — fixed below the scroll area. */
  footer?: React.ReactNode;
  /** Content above toolbar (charts, summary cards) that scrolls away with the page. */
  beforeToolbar?: React.ReactNode;
  headerProps?: Omit<DataTableColumnHeaderProps<TData>, 'table'>;
  bodyProps?: Omit<
    React.ComponentProps<typeof DataTableBody<TData>>,
    'table' | 'colSpan'
  >;
  /** Extra classes on the outer sticky shell. */
  className?: string;
  /** Override max-height on the table scroll container. */
  scrollContainerClassName?: string;
  /** When false, toolbar is not sticky (e.g. inside dialogs). */
  stickyToolbar?: boolean;
  /** Disable scroll chaining to the page (e.g. nested dialogs). */
  scrollChain?: boolean;
};

/**
 * Standard list-page table shell: optional page content, sticky toolbar, bounded
 * table scroll with sticky headers, footer pinned below.
 */
export function DataTableLayout<TData>({
  table,
  colSpan,
  toolbar,
  footer,
  beforeToolbar,
  headerProps,
  bodyProps,
  className,
  scrollContainerClassName,
  stickyToolbar = true,
  scrollChain = true,
}: DataTableLayoutProps<TData>) {
  const scrollChainRef = useNestedScrollChain<HTMLDivElement>();
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const mergedScrollRef = composeRefs(
    scrollChain ? scrollChainRef : undefined,
    scrollContainerRef,
  );

  const {
    showFilterRow = false,
    stickyTopHeader = true,
    compactFilterHeader = true,
    stickyFilterRowTopClassName = DATA_TABLE_STICKY_FILTER_ROW_TOP,
    stickyTopHeaderCellClassName: stickyTopHeaderCellClassNameProp,
    ...restHeaderProps
  } = headerProps ?? {};

  const stickyTopHeaderCellClassName = (
    columnId: string,
    layer: 'title' | 'filter',
  ) =>
    mergeDataTableStickyHeaderCellClassName(
      columnId,
      layer,
      stickyTopHeaderCellClassNameProp,
    );

  return (
    <div className={cn('flex w-full flex-col', className)}>
      {beforeToolbar}

      <div
        className={cn(
          stickyToolbar &&
            'sticky top-0 z-20 flex max-h-[100dvh] flex-col bg-background shadow-sm',
          !stickyToolbar && 'flex flex-col',
        )}
      >
        {toolbar ? (
          <div
            className={cn(
              'shrink-0 space-y-2 px-2 pb-2 pt-1 sm:px-0',
              /* Legacy toolbar rows: stack on mobile, wrap filter chips */
              '[&>div.flex]:flex-col [&>div.flex]:gap-3 sm:[&>div.flex]:flex-row sm:[&>div.flex]:items-start sm:[&>div.flex]:justify-between',
              '[&>div.flex>.flex-1]:w-full [&>div.flex>.flex-1]:flex-wrap [&>div.flex>.flex-1]:gap-2 [&>div.flex>.flex-1]:space-x-0',
              '[&>div.flex>:last-child]:flex [&>div.flex>:last-child]:flex-wrap [&>div.flex>:last-child]:justify-start [&>div.flex>:last-child]:gap-2 sm:[&>div.flex>:last-child]:justify-end',
            )}
          >
            {toolbar}
          </div>
        ) : null}

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden rounded-md border">
            <Table
              containerRef={mergedScrollRef}
              scrollChain={false}
              bounded={false}
              containerClassName={cn(
                DATA_TABLE_SCROLL_CONTAINER_CLASS,
                scrollContainerClassName,
              )}
            >
              <DataTableHeader
                table={table}
                showFilterRow={showFilterRow}
                stickyTopHeader={stickyTopHeader}
                compactFilterHeader={compactFilterHeader}
                stickyFilterRowTopClassName={stickyFilterRowTopClassName}
                stickyTopHeaderCellClassName={stickyTopHeaderCellClassName}
                {...restHeaderProps}
              />
              <DataTableBody table={table} colSpan={colSpan} {...bodyProps} />
            </Table>
          </div>

          {footer ? (
            <div className="shrink-0 border-t bg-background px-2 sm:px-4">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
