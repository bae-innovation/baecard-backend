import type { Column, Table } from '@tanstack/react-table';
import React from 'react';

import { DataTableFacetedFilter } from '@/components/shared/data-table/data-table-faceted-filter';
import { cn } from '@/lib/utils';

export type FilterOption = {
  label: string | React.ReactNode;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  facetCount?: number;
};

export type FilterConfig<TData> = {
  columnId: keyof TData; // Ensures only valid column keys
  title: string;
  options: FilterOption[];
};

type DataTableFiltersProps<TData> = {
  table: Table<TData>;
  filters: FilterConfig<TData>[]; // Allowing multiple value types
  className?: string;
};

export function DataTableFilters<TData>({
  table,
  filters,
  className,
}: DataTableFiltersProps<TData>) {
  return (
    <div
      className={cn('flex shrink-0 flex-nowrap items-center gap-2', className)}
    >
      {filters.map((filter) => {
        const column = table.getColumn(filter.columnId as string) as
          | Column<TData, unknown>
          | undefined;

        return (
          column && (
            <DataTableFacetedFilter
              key={String(filter.columnId)}
              column={column}
              title={filter.title}
              options={filter.options}
            />
          )
        );
      })}
    </div>
  );
}
