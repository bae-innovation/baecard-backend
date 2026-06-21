import { format } from 'date-fns';

// Format dates for better readability
export function formatDateTimeWithLabel(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Error formatting date:', new Error(dateString));
    return dateString;
  }

  return format(new Date(dateString), "PPP 'at' p");
}

// Format date as YYYY-MM-DD in local timezone (not UTC)
// This prevents the one-day offset issue when converting to UTC
export function formatDateForAPI(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
