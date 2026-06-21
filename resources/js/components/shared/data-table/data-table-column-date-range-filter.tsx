import type { Column } from '@tanstack/react-table';

import {
  ExportStyleDateRangePicker,
  type ExportStyleDateRangePickerProps,
} from '@/components/shared/export-style-date-range-picker';

export type DateRangeFilterValue = {
  from?: string;
  to?: string;
};

function filterValueFromColumn(value: unknown): DateRangeFilterValue | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  return {
    from: typeof record.from === 'string' ? record.from : undefined,
    to: typeof record.to === 'string' ? record.to : undefined,
  };
}

type DataTableColumnDateRangeFilterProps<TData> = {
  column: Column<TData, unknown>;
  pickerProps?: Partial<
    Omit<
      ExportStyleDateRangePickerProps,
      'from' | 'to' | 'onChange'
    >
  >;
};

export function DataTableColumnDateRangeFilter<TData>({
  column,
  pickerProps,
}: DataTableColumnDateRangeFilterProps<TData>) {
  const value = filterValueFromColumn(column.getFilterValue());

  return (
    <ExportStyleDateRangePicker
      from={value?.from}
      to={value?.to}
      onChange={(next) => {
        if (!next.from && !next.to) {
          column.setFilterValue(undefined);
          return;
        }
        column.setFilterValue({ from: next.from, to: next.to });
      }}
      displayVariant="friendly-range"
      align="start"
      {...pickerProps}
    />
  );
}
