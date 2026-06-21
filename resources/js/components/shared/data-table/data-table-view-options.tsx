import type { Table } from '@tanstack/react-table';
import { ChevronDown, Download, RefreshCw, Upload } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { featureNotImplemented } from '@/helpers/feature-not-implemented';

type DataTableViewOptionsProps<TData> = {
  table: Table<TData>;
  /** Merged onto the actions row wrapper (e.g. `shrink-0 flex-nowrap`). */
  className?: string;
  showExport?: boolean;
  /** Disables Export while an export mutation is pending. */
  exportPending?: boolean;
  onExport?: () => void;
  showImport?: boolean;
  onImport?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  columnLabelFormatter?: (columnId: string) => string;
};

export function DataTableViewOptions<TData>({
  table,
  className,
  showExport = false,
  exportPending = false,
  onExport,
  showImport = false,
  onImport,
  onRefresh,
  isRefreshing,
  columnLabelFormatter = (columnId) => columnId.replaceAll('_', ' '),
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        size="sm"
        variant="outline"
        className="h-8 gap-1"
        onClick={() => {
          table.resetRowSelection();
          onRefresh?.();
        }}
        disabled={isRefreshing}
      >
        <RefreshCw className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
      {showImport && onImport ? (
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          type="button"
          onClick={() => onImport()}
        >
          <Upload className="size-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>
      ) : null}
      {showExport && (
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1"
          disabled={exportPending}
          onClick={() => (onExport ? onExport() : featureNotImplemented())}
        >
          <Download className="size-4" />
          <span className="hidden sm:inline">
            {exportPending ? 'Exporting…' : 'Export'}
          </span>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            Columns <ChevronDown className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter(
              (column) =>
                column.accessorFn !== undefined && column.getCanHide(),
            )
            .map((column) => {
              return (
                <DropdownMenuItem
                  key={column.id}
                  className="capitalize"
                  onClick={() =>
                    column.toggleVisibility(!column.getIsVisible())
                  }
                >
                  <Checkbox checked={column.getIsVisible()} className="mr-2" />
                  {columnLabelFormatter(column.id)}
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
