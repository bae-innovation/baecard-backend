import { parse } from 'date-fns';

export function formatDateYYYYMMDD(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function parseYYYYMMDD(value: string | undefined) {
  if (!value) return undefined;
  const d = parse(value, 'yyyy-MM-dd', new Date());
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export function defaultTodayRangeStrings() {
  const t = new Date();
  const s = formatDateYYYYMMDD(t);
  return { from: s, to: s };
}
