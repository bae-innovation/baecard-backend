'use client';

import * as React from 'react';
import {
  addDays,
  differenceInCalendarDays,
  format,
  isSameYear,
} from 'date-fns';
import { ArrowRight, CalendarDays, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  formatDateYYYYMMDD,
  parseYYYYMMDD,
} from '@/components/shared/date-range-utils';
import { cn } from '@/lib/utils';

function formatFriendlyRange(fromStr: string, toStr: string) {
  const from = parseYYYYMMDD(fromStr);
  const to = parseYYYYMMDD(toStr);
  if (!from || !to) return '—';
  if (fromStr === toStr) {
    return format(from, 'MMM d, yyyy');
  }
  if (isSameYear(from, to)) {
    return `${format(from, 'MMM d')} → ${format(to, 'MMM d, yyyy')}`;
  }
  return `${format(from, 'MMM d, yyyy')} → ${format(to, 'MMM d, yyyy')}`;
}

function useIsMobileSheetPreferred(enabled: boolean) {
  const [mobile, setMobile] = React.useState(false);
  React.useEffect(() => {
    if (!enabled) {
      setMobile(false);
      return;
    }
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [enabled]);
  return mobile;
}

export type DateRangePresetShortcut = {
  value: string;
  label: string;
  getRange: () => { from: string; to: string };
};

export type ExportStyleDateRangePickerProps = {
  from: string | undefined;
  to: string | undefined;
  onChange: (next: {
    from: string | undefined;
    to: string | undefined;
  }) => void;
  selectionMode?: 'range' | 'single';
  maxRangeDays?: number;
  maxRangeTooltipMessage?: string;
  displayVariant?: 'mono-iso' | 'friendly-range';
  align?: 'start' | 'center';
  portalled?: boolean;
  useMobileSheet?: boolean;
  className?: string;
  onClear?: () => void;
  triggerButtonClassName?: string;
  /**
   * When true, blocks closing the popover until both ends are chosen (partner export behavior).
   * When false, popover can close anytime (SP routes).
   */
  blockPopoverCloseUntilComplete?: boolean;
  /** Quick period buttons rendered inside the calendar popover (above the calendar). */
  presetShortcuts?: DateRangePresetShortcut[];
  /** Highlights the active preset shortcut when set. */
  activePreset?: string;
  onPresetSelect?: (value: string) => void;
  numberOfMonths?: 1 | 2;
};

export function ExportStyleDateRangePicker({
  from,
  to,
  onChange,
  selectionMode = 'range',
  maxRangeDays,
  maxRangeTooltipMessage = 'Maximum range is 7 days',
  displayVariant = 'mono-iso',
  align = 'start',
  portalled = true,
  useMobileSheet = false,
  className,
  onClear,
  triggerButtonClassName,
  blockPopoverCloseUntilComplete = false,
  presetShortcuts,
  activePreset,
  onPresetSelect,
  numberOfMonths = 1,
}: ExportStyleDateRangePickerProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [rangeStep, setRangeStep] = React.useState<'from' | 'to'>('from');
  const mobileSheet = useIsMobileSheetPreferred(Boolean(useMobileSheet));

  const selectedFrom = React.useMemo(() => parseYYYYMMDD(from), [from]);
  const selectedTo = React.useMemo(() => parseYYYYMMDD(to), [to]);
  const selectedRange = React.useMemo(
    () =>
      selectedFrom || selectedTo
        ? { from: selectedFrom, to: selectedTo }
        : undefined,
    [selectedFrom, selectedTo],
  );
  const selectedSingle = React.useMemo(
    () => selectedFrom ?? selectedTo,
    [selectedFrom, selectedTo],
  );

  const hasFullRange = !!from && !!to;

  const rangeSummary = React.useMemo(() => {
    if (selectionMode === 'single') return from ?? to ?? '—';
    if (!from || !to) return '—';
    return `${from} → ${to}`;
  }, [from, to, selectionMode]);

  const displayLabel = React.useMemo(() => {
    if (displayVariant === 'friendly-range' && from && to) {
      return formatFriendlyRange(from, to);
    }
    return null;
  }, [displayVariant, from, to]);

  const handleDayPick = React.useCallback(
    (day: Date) => {
      if (selectionMode === 'single') {
        const date = formatDateYYYYMMDD(day);
        onChange({ from: date, to: date });
        setRangeStep('from');
        setCalendarOpen(false);
        return;
      }
      if (rangeStep === 'from') {
        onChange({ from: formatDateYYYYMMDD(day), to: undefined });
        setRangeStep('to');
        setCalendarOpen(true);
        return;
      }

      const start = parseYYYYMMDD(from);
      if (!start) {
        onChange({ from: formatDateYYYYMMDD(day), to: undefined });
        setRangeStep('to');
        setCalendarOpen(true);
        return;
      }

      let endDay = day;
      if (maxRangeDays !== undefined) {
        const span = differenceInCalendarDays(day, start) + 1;
        if (span > maxRangeDays) {
          endDay = addDays(start, maxRangeDays - 1);
          toast.message(maxRangeTooltipMessage, {
            description: `Adjusted to ${maxRangeDays} days.`,
          });
        }
      }

      if (endDay.getTime() < start.getTime()) {
        onChange({
          from: formatDateYYYYMMDD(endDay),
          to: formatDateYYYYMMDD(start),
        });
      } else {
        onChange({
          from: formatDateYYYYMMDD(start),
          to: formatDateYYYYMMDD(endDay),
        });
      }

      setRangeStep('from');
      setCalendarOpen(false);
    },
    [
      from,
      rangeStep,
      onChange,
      maxRangeDays,
      maxRangeTooltipMessage,
      selectionMode,
    ],
  );

  const onPopoverOpenChange = React.useCallback(
    (next: boolean) => {
      if (
        blockPopoverCloseUntilComplete &&
        !next &&
        (!hasFullRange || rangeStep === 'to')
      ) {
        return;
      }
      setCalendarOpen(next);
    },
    [blockPopoverCloseUntilComplete, hasFullRange, rangeStep],
  );

  const openPicker = React.useCallback(() => {
    setCalendarOpen(true);
    if (selectionMode === 'single') {
      setRangeStep('from');
      return;
    }
    setRangeStep(from && !to ? 'to' : 'from');
  }, [from, to, selectionMode]);

  const handlePresetShortcut = React.useCallback(
    (shortcut: DateRangePresetShortcut) => {
      const range = shortcut.getRange();
      onChange({ from: range.from, to: range.to });
      onPresetSelect?.(shortcut.value);
      setRangeStep('from');
      setCalendarOpen(false);
    },
    [onChange, onPresetSelect],
  );

  const presetShortcutsPanel =
    presetShortcuts && presetShortcuts.length > 0 ? (
      <div className="grid grid-cols-2 gap-1 border-b p-2">
        {presetShortcuts.map((shortcut) => (
          <Button
            key={shortcut.value}
            type="button"
            variant={activePreset === shortcut.value ? 'secondary' : 'ghost'}
            size="sm"
            className="h-9 min-h-11 text-xs"
            onClick={() => handlePresetShortcut(shortcut)}
          >
            {shortcut.label}
          </Button>
        ))}
      </div>
    ) : null;

  const calendarBody = (
    <>
      {presetShortcutsPanel}
      {selectionMode === 'single' ? (
        <Calendar
          autoFocus
          mode="single"
          defaultMonth={selectedSingle}
          selected={selectedSingle}
          onDayClick={(d) => handleDayPick(d)}
          numberOfMonths={numberOfMonths}
        />
      ) : (
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={selectedRange?.from}
          selected={selectedRange}
          onDayClick={(d) => handleDayPick(d)}
          numberOfMonths={numberOfMonths}
        />
      )}
      <div className="border-t px-3 py-2">
        <div className="text-center text-xs text-muted-foreground">
          Selected: <span className="font-mono">{rangeSummary}</span>
        </div>
        <div className="mt-2 flex justify-end">
          {from && to ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-muted-foreground"
              onClick={() => {
                onChange({ from: undefined, to: undefined });
                setRangeStep('from');
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );

  const triggerButton = (
    <Button
      type="button"
      variant="outline"
      role="combobox"
      aria-expanded={calendarOpen}
      aria-haspopup="dialog"
      aria-controls={
        calendarOpen
          ? mobileSheet
            ? 'sp-date-range-sheet'
            : 'sp-date-range-popover'
          : undefined
      }
      className={cn(
        'flex h-auto flex-row items-center justify-center gap-2 py-3 text-center font-normal',
        displayVariant === 'friendly-range' ? 'min-w-[220px] px-3' : 'w-full',
        onClear && from && to && 'overflow-hidden pr-2',
        onClear && from && to && displayVariant === 'friendly-range' && 'pr-10',
        triggerButtonClassName,
      )}
      onClick={openPicker}
    >
      <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
      {displayVariant === 'friendly-range' && displayLabel ? (
        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
          {displayLabel}
        </span>
      ) : (
        <div className="flex items-center justify-center gap-4">
          <span className="min-w-28 font-mono text-sm text-foreground">
            {from ?? '—'}
          </span>
          <ArrowRight className="size-5 shrink-0 text-muted-foreground" />
          <span className="min-w-28 font-mono text-sm text-foreground">
            {to ?? '—'}
          </span>
        </div>
      )}
      {onClear && from && to ? (
        <span
          role="button"
          tabIndex={0}
          className="ml-auto inline-flex shrink-0 rounded-sm p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
            setRangeStep('from');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onClear();
              setRangeStep('from');
            }
          }}
          aria-label="Reset date range to today"
        >
          <X className="size-4" />
        </span>
      ) : null}
    </Button>
  );

  if (mobileSheet && useMobileSheet) {
    return (
      <div className={cn('flex w-full max-w-md items-center gap-2', className)}>
        {triggerButton}
        <Sheet open={calendarOpen} onOpenChange={setCalendarOpen}>
          <SheetContent side="bottom" className="h-[90dvh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Select date range</SheetTitle>
            </SheetHeader>
            <div
              id="sp-date-range-sheet"
              role="dialog"
              aria-label="Select date range"
              className="mt-4"
            >
              {calendarBody}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={cn('flex w-full items-center gap-2', className)}>
      <Popover open={calendarOpen} onOpenChange={onPopoverOpenChange}>
        <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
        <PopoverContent
          id="sp-date-range-popover"
          role="dialog"
          aria-label="Select date range"
          className={cn(
            'z-[60] w-auto origin-top p-0',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          )}
          align={align}
          portalled={portalled}
          side="bottom"
          sideOffset={6}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {calendarBody}
        </PopoverContent>
      </Popover>
    </div>
  );
}
