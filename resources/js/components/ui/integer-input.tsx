import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

function clamp(n: number, min?: number, max?: number): number {
  let out = n;
  if (min != null) out = Math.max(min, out);
  if (max != null) out = Math.min(max, out);
  return out;
}

const preventWheelChange = {
  onWheel: (e: React.WheelEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
  },
} as const;

type IntegerInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode' | 'onWheel'
> & {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

/** Whole-number field: digits only, arrow keys ±step, no scroll-wheel changes. */
export function IntegerInput({
  value,
  onValueChange,
  min = 0,
  max,
  step = 1,
  className,
  onKeyDown,
  ...props
}: IntegerInputProps) {
  const display = Number.isFinite(value) ? String(value) : String(min);

  const applyDigits = (raw: string) => {
    const d = digitsOnly(raw);
    if (!d) {
      onValueChange(min);
      return;
    }
    onValueChange(clamp(parseInt(d, 10), min, max));
  };

  const nudge = (delta: number) => {
    onValueChange(clamp(value + delta, min, max));
  };

  return (
    <Input
      {...preventWheelChange}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      value={display}
      onChange={(e) => applyDigits(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          nudge(step);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          nudge(-step);
        }
        onKeyDown?.(e);
      }}
      className={cn('tabular-nums', className)}
      {...props}
    />
  );
}

type DigitsInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'value' | 'onChange' | 'type' | 'inputMode' | 'onWheel'
> & {
  value: string;
  onValueChange: (value: string) => void;
  /** Parsed integer min when using arrow keys (optional). */
  min?: number;
  max?: number;
  step?: number;
};

/** Digit-only text field (e.g. order IDs): same keyboard/wheel behavior as IntegerInput. */
export function DigitsInput({
  value,
  onValueChange,
  min,
  max,
  step = 1,
  className,
  onKeyDown,
  ...props
}: DigitsInputProps) {
  const applyDigits = (raw: string) => {
    onValueChange(digitsOnly(raw));
  };

  const nudge = (delta: number) => {
    if (!value.trim()) {
      if (delta < 0) return;
      const start = clamp(1, min ?? 1, max);
      onValueChange(String(start));
      return;
    }
    const parsed = parseInt(value, 10);
    const base = Number.isFinite(parsed) ? parsed : 0;
    const next = clamp(base + delta, min ?? 0, max);
    if (next <= 0) {
      onValueChange('');
      return;
    }
    onValueChange(String(next));
  };

  return (
    <Input
      {...preventWheelChange}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      autoComplete="off"
      value={value}
      onChange={(e) => applyDigits(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          nudge(step);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          nudge(-step);
        }
        onKeyDown?.(e);
      }}
      className={cn('tabular-nums', className)}
      {...props}
    />
  );
}
