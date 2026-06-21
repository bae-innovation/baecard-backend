import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DateRangeWithQuickSelectProps {
  value?: {
    start: Date;
    end?: Date;
  };
  onChange: (start?: Date, end?: Date) => void;
  quickSelectOptions?: Array<{
    label: string;
    value: string;
    getDateRange: () => { start: Date; end: Date };
  }>;
  className?: string;
}

export function DateRangeWithQuickSelect({
  value,
  onChange,
  quickSelectOptions = [
    {
      label: 'Today',
      value: 'today',
      getDateRange: () => {
        const today = new Date();
        return { start: today, end: today };
      },
    },
    {
      label: 'Last 7 days',
      value: 'last7days',
      getDateRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 7);
        return { start, end };
      },
    },
    {
      label: 'Last 30 days',
      value: 'last30days',
      getDateRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return { start, end };
      },
    },
    {
      label: 'This Week',
      value: 'thisWeek',
      getDateRange: () => {
        const now = new Date();
        return {
          start: startOfWeek(now, { weekStartsOn: 1 }), // Monday
          end: endOfWeek(now, { weekStartsOn: 1 }),
        };
      },
    },
    {
      label: 'This Month',
      value: 'thisMonth',
      getDateRange: () => {
        const now = new Date();
        return {
          start: startOfMonth(now),
          end: endOfMonth(now),
        };
      },
    },
    {
      label: 'This Year',
      value: 'thisYear',
      getDateRange: () => {
        const now = new Date();
        return {
          start: startOfYear(now),
          end: endOfYear(now),
        };
      },
    },
    {
      label: 'Last Week',
      value: 'lastWeek',
      getDateRange: () => {
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        return {
          start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
          end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
        };
      },
    },
    {
      label: 'Last Month',
      value: 'lastMonth',
      getDateRange: () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      },
    },
    {
      label: 'Last Year',
      value: 'lastYear',
      getDateRange: () => {
        const lastYear = new Date();
        lastYear.setFullYear(lastYear.getFullYear() - 1);
        return {
          start: startOfYear(lastYear),
          end: endOfYear(lastYear),
        };
      },
    },
  ],
  className = '',
}: DateRangeWithQuickSelectProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [month, setMonth] = useState(() =>
    startOfMonth(value?.start ?? new Date()),
  );

  useEffect(() => {
    if (value?.start) {
      setMonth(startOfMonth(value.start));
    }
  }, [value?.start?.getTime()]);

  const handleQuickSelect = (optionValue: string) => {
    const option = quickSelectOptions.find((opt) => opt.value === optionValue);
    if (option) {
      const range = option.getDateRange();
      onChange(range.start, range.end);
      setMonth(startOfMonth(range.start));
      setCalendarOpen(false);
    }
  };

  return (
    <div className={className}>
      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.start ? (
              value.end ? (
                <>
                  {format(value.start, 'LLL dd, y')} -{' '}
                  {format(value.end, 'LLL dd, y')}
                </>
              ) : (
                format(value.start, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="range"
              month={month}
              onMonthChange={setMonth}
              selected={{
                from: value?.start,
                to: value?.end,
              }}
              onSelect={(range) => {
                onChange(range?.from, range?.to);
                if (range?.from && range?.to) {
                  setCalendarOpen(false);
                }
              }}
              className="rounded-md border-0 p-0"
            />
          </div>
          {quickSelectOptions.length > 0 ? (
            <div className="border-t p-3">
              <Select onValueChange={handleQuickSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Quick select" />
                </SelectTrigger>
                <SelectContent>
                  {quickSelectOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}
