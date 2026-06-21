import { format } from 'date-fns';
import { describe, expect, it, type Mock, vi } from 'vitest';

import { formatDateTimeWithLabel } from '@/utils/date-formatter-with-label'; // Adjust to your actual path

// Mock the format function to prevent actual date formatting during testing
vi.mock('date-fns', () => ({
  format: vi.fn(),
}));

describe('formatDateTimeWithLabel', () => {
  it('should format a valid date string correctly', () => {
    const mockDate = '2025-03-19T12:00:00Z'; // A valid date string
    const expectedFormattedDate = 'March 19th, 2025 at 12:00 PM'; // Expected formatted output

    // Mock the return value of the date-fns format function
    (format as Mock).mockReturnValue(expectedFormattedDate);

    const result = formatDateTimeWithLabel(mockDate);
    expect(result).toBe(expectedFormattedDate);
    expect(format).toHaveBeenCalledWith(new Date(mockDate), "PPP 'at' p");
  });

  it('should handle invalid date strings gracefully', () => {
    const invalidDate = 'invalid-date-string';
    const result = formatDateTimeWithLabel(invalidDate);

    // Since the date is invalid, it should return the original input
    expect(result).toBe(invalidDate);
  });

  it('should return the same string for empty date input', () => {
    const emptyDate = '';
    const result = formatDateTimeWithLabel(emptyDate);
    expect(result).toBe(emptyDate);
  });

  it('should log error when date formatting fails', () => {
    const invalidDate = 'invalid-date-string';

    // Mocking console.error to capture error logs
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = formatDateTimeWithLabel(invalidDate);

    expect(result).toBe(invalidDate);
    expect(errorSpy).toHaveBeenCalledWith(
      'Error formatting date:',
      expect.any(Error),
    );

    // Restore the original console.error
    errorSpy.mockRestore();
  });
});
