import { format, isValid, parse } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import type { Column } from '@tanstack/react-table';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

function dayStringFromFilter(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  return value.trim();
}

type DataTableColumnDateFilterProps<TData> = {
  column: Column<TData, unknown>;
};

export function DataTableColumnDateFilter<TData>({
  column,
}: DataTableColumnDateFilterProps<TData>) {
  const day = dayStringFromFilter(column.getFilterValue());
  const selected = React.useMemo(() => {
    if (!day) return undefined;
    const d = parse(day, 'yyyy-MM-dd', new Date());
    return isValid(d) ? d : undefined;
  }, [day]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={day ? `Date filter: ${day}` : 'Filter by date'}
          className={cn(
            'h-8 w-full max-w-[140px] justify-start border-dashed px-2 text-xs font-normal',
            !day && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-1 size-3.5 shrink-0 opacity-70" />
          {day ? (
            <span className="truncate">{day}</span>
          ) : (
            <span className="sr-only">Filter by date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(d) => {
            column.setFilterValue(d ? format(d, 'yyyy-MM-dd') : undefined);
          }}
          initialFocus
        />
        <div className="border-t p-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            disabled={!day}
            onClick={() => column.setFilterValue(undefined)}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
