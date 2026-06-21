import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Table } from '@tanstack/react-table';

export type SearchInputConfig<TData> = {
  columnId: keyof TData; // Ensures only valid column keys
  placeholder: string;
};

type DataTableSearchInputsProps<TData> = {
  table: Table<TData>;
  inputs: SearchInputConfig<TData>[]; // Array of search inputs
  /** Merged into each search input (e.g. responsive sizing). */
  inputClassName?: string;
};

export function DataTableSearchInputs<TData>({
  table,
  inputs,
  inputClassName,
}: DataTableSearchInputsProps<TData>) {
  return (
    <>
      {inputs.map((input) => {
        const column = table.getColumn(input.columnId as string);
        if (!column) return null; // Skip if column doesn't exist

        return (
          <Input
            key={String(input.columnId)}
            placeholder={input.placeholder}
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            className={cn(
              'h-8 w-full min-w-0 max-w-full rounded border border-dashed px-2 sm:w-[min(100%,10rem)] sm:max-w-[10rem] lg:w-[min(100%,15.625rem)] lg:max-w-[15.625rem]',
              inputClassName,
            )}
          />
        );
      })}
    </>
  );
}
