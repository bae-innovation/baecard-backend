import { formatPrice } from '@/utils/number-formatter';

export function formatOrderMoney(value: number | null | undefined) {
  if (value == null) return '—';
  return formatPrice(Number(value));
}

export function formatOrderDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

export function formatOrderStatus(status: string) {
  return status.replace(/_/g, ' ');
}
