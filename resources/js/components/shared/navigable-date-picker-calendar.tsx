import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import * as React from 'react';

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type DatePickerYearRange = 'birthdate' | 'joining' | 'default';

type PickerView = 'year' | 'month' | 'day';

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

const MONTH_FULL = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

function getYearBounds(preset: DatePickerYearRange) {
  const current = new Date().getFullYear();
  switch (preset) {
    case 'joining':
      return { start: current - 10, end: current + 5 };
    case 'birthdate':
      return { start: current - 80, end: current };
    default:
      return { start: current - 50, end: current + 10 };
  }
}

function buildYears(start: number, end: number) {
  const years: number[] = [];
  for (let y = end; y >= start; y -= 1) {
    years.push(y);
  }
  return years;
}

function setDraftYear(prev: Date, year: number) {
  const next = new Date(prev);
  next.setFullYear(year);
  return next;
}

function setDraftMonth(prev: Date, monthIndex: number) {
  const next = new Date(prev);
  next.setMonth(monthIndex);
  return next;
}

const viewTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15, ease: 'easeOut' as const },
};

export type NavigableDatePickerCalendarProps = {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  yearRange?: DatePickerYearRange;
  className?: string;
};

export function NavigableDatePickerCalendar({
  value,
  onChange,
  yearRange = 'default',
  className,
}: NavigableDatePickerCalendarProps) {
  const [view, setView] = React.useState<PickerView>('day');
  const [draft, setDraft] = React.useState<Date>(() => value ?? new Date());

  React.useEffect(() => {
    if (value) setDraft(value);
  }, [value]);

  const { start: yearStart, end: yearEnd } = getYearBounds(yearRange);
  const years = React.useMemo(
    () => buildYears(yearStart, yearEnd),
    [yearStart, yearEnd],
  );

  const selectedYear = draft.getFullYear();
  const selectedMonth = draft.getMonth();
  const headerMonthLabel = MONTH_FULL[selectedMonth];
  const showBack = view !== 'day';

  const goBackToCalendar = () => setView('day');

  const selectedYearRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (view !== 'year') return;
    const id = requestAnimationFrame(() => {
      selectedYearRef.current?.scrollIntoView({ block: 'center' });
    });
    return () => cancelAnimationFrame(id);
  }, [view, selectedYear]);

  return (
    <div
      className={cn(
        'flex w-[min(100vw-2rem,280px)] min-w-[280px] flex-col',
        className,
      )}
    >
      <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-1 px-1 pb-2">
        {showBack ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={goBackToCalendar}
            aria-label="Back to calendar"
          >
            <ChevronLeft className="size-4" aria-hidden />
          </Button>
        ) : (
          <span className="size-9" aria-hidden />
        )}

        <div className="flex min-w-0 items-center justify-center gap-1.5 text-sm font-medium">
          {view === 'year' ? (
            <span>Select year</span>
          ) : view === 'month' ? (
            <>
              <span className="text-muted-foreground">Year</span>
              <button
                type="button"
                className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setView('year')}
              >
                {selectedYear}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setView('month')}
              >
                {headerMonthLabel}
              </button>
              <button
                type="button"
                className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setView('year')}
              >
                {selectedYear}
              </button>
            </>
          )}
        </div>

        <span className="size-9" aria-hidden />
      </div>

      <div className="flex min-h-[280px] flex-col justify-center">
        <AnimatePresence mode="wait">
          {view === 'year' ? (
            <motion.div
              key="year"
              {...viewTransition}
              className="grid max-h-64 grid-cols-3 gap-1 overflow-y-auto overscroll-contain px-1"
            >
              {years.map((year) => {
                const isSelected = year === selectedYear;
                return (
                  <button
                    key={year}
                    ref={isSelected ? selectedYearRef : undefined}
                    type="button"
                    aria-pressed={isSelected}
                    className={cn(
                      'min-h-11 rounded-md text-base transition-colors duration-150',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    onClick={() => {
                      setDraft((prev) => setDraftYear(prev, year));
                      setView('day');
                    }}
                  >
                    {year}
                  </button>
                );
              })}
            </motion.div>
          ) : null}

          {view === 'month' ? (
            <motion.div
              key="month"
              {...viewTransition}
              className="grid grid-cols-3 gap-1 px-1"
            >
              {MONTH_LABELS.map((label, monthIndex) => {
                const isSelected = monthIndex === selectedMonth;
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isSelected}
                    className={cn(
                      'min-h-11 rounded-md text-base transition-colors duration-150',
                      'hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      isSelected &&
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                    )}
                    onClick={() => {
                      setDraft((prev) => setDraftMonth(prev, monthIndex));
                      setView('day');
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </motion.div>
          ) : null}

          {view === 'day' ? (
            <motion.div
              key="day"
              {...viewTransition}
              className="flex w-full justify-center px-0"
            >
              <Calendar
                mode="single"
                month={draft}
                onMonthChange={setDraft}
                selected={value}
                onSelect={(d) => {
                  if (d) {
                    setDraft(d);
                    onChange(d);
                  }
                }}
                hideNavigation
                className="border-0 bg-transparent p-0 shadow-none [--cell-size:2.25rem]"
                classNames={{
                  root: 'mx-auto w-fit',
                  months: 'w-full',
                  month: 'w-full gap-3',
                  month_caption: 'hidden',
                  nav: 'hidden',
                  table: 'mx-auto',
                }}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {value ? (
        <p className="mt-2 px-1 text-center text-xs text-muted-foreground">
          Selected: {format(value, 'd MMMM yyyy')}
        </p>
      ) : null}
    </div>
  );
}
