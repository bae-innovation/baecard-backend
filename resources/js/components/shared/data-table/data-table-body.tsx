import { flexRender, type Row, type Table } from '@tanstack/react-table';

import type { DataTableColumnMeta } from '@/components/shared/data-table/data-table-header';
import { getDataTableStickyColumnCellClassName } from '@/components/shared/data-table/data-table-sticky-columns';
import { TableBody, TableCell, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

type ColumnMeta = {
  className?: string;
};

type DataTableBodyProps<TData> = {
  table: Table<TData>;
  colSpan: number;
  onRowClick?: (row: Row<TData>) => void;
  /** Stable DOM id for the `<tr>` (e.g. for scroll-into-view). */
  getRowDomId?: (row: TData) => string;
  isRowHighlighted?: (row: TData) => boolean;
  /** Merged into every body cell (e.g. `align-top` for dense sticky tables). */
  cellClassName?: string;
  /** Shown when the table has no rows (after filters). */
  emptyMessage?: string;
};

export function DataTableBody<TData>({
  table,
  colSpan,
  onRowClick,
  getRowDomId,
  isRowHighlighted,
  cellClassName,
  emptyMessage = 'No results.',
}: DataTableBodyProps<TData>) {
  return (
    <TableBody>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            id={getRowDomId?.(row.original)}
            data-state={row.getIsSelected() && 'selected'}
            className={cn(
              'group',
              onRowClick &&
                'cursor-pointer transition-colors duration-150 hover:bg-muted/40',
              isRowHighlighted?.(row.original) &&
                'bg-primary/10 ring-2 ring-inset ring-primary/35',
            )}
            onClick={
              onRowClick
                ? (event) => {
                    const target = event.target as HTMLElement | null;
                    if (
                      target?.closest(
                        'button, a, input, textarea, select, label, [role="checkbox"], [data-review-editable-cell]',
                      )
                    ) {
                      return;
                    }
                    onRowClick(row);
                  }
                : undefined
            }
          >
            {row.getVisibleCells().map((cell) => {
              const meta = cell.column.columnDef.meta as
                | (ColumnMeta & DataTableColumnMeta)
                | undefined;
              const stickyPinClassName = getDataTableStickyColumnCellClassName(
                cell.column.id,
                meta,
                'body',
              );
              return (
                <TableCell
                  key={cell.id}
                  className={cn(
                    meta?.className,
                    stickyPinClassName,
                    cellClassName,
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={colSpan} className="h-24 text-center">
            {emptyMessage}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}
