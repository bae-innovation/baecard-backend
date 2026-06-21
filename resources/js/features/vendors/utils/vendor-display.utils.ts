export function formatVendorDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}
