import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import {
  NavigableDatePickerCalendar,
  type DatePickerYearRange,
} from '@/components/shared/navigable-date-picker-calendar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export type SingleDatePickerProps = {
  id: string;
  label: string;
  value: Date | undefined;
  onChange: (d: Date | undefined) => void;
  yearRange?: DatePickerYearRange;
  optional?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
};

export function SingleDatePicker({
  id,
  label,
  value,
  onChange,
  yearRange = 'default',
  optional = false,
  disabled = false,
  className,
  error,
}: SingleDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="grid min-w-0 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            className={cn(
              'h-9 w-full justify-start text-left text-sm font-normal',
              !value && 'text-muted-foreground',
              error && 'border-destructive',
              className,
            )}
          >
            <CalendarIcon className="mr-2 size-4 shrink-0" aria-hidden />
            {value ? format(value, 'd MMMM yyyy') : 'Pick a date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border bg-popover p-2 shadow-md duration-150 ease-out animate-in fade-in-0 zoom-in-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          align="start"
        >
          <div className="flex flex-col items-stretch gap-2">
            {open ? (
              <NavigableDatePickerCalendar
                value={value}
                yearRange={yearRange}
                onChange={(d) => {
                  onChange(d);
                  if (d) setOpen(false);
                }}
              />
            ) : null}
            {optional ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 text-sm"
                disabled={!value}
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                Clear date
              </Button>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
