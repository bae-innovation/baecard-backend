import { parsePhoneNumberWithError } from 'libphonenumber-js';

/**
 * Validates a Bangladesh phone number
 * Accepts formats like: +8801712345678, 8801712345678, 01712345678, 0171-234-5678, 0171 234 5678
 * @param value - The phone number string to validate
 * @returns true if valid, error message string if invalid
 */
export function validateBangladeshPhone(value: string): string | true {
  if (!value || value.trim() === '') {
    return 'Phone number is required';
  }

  const invalidMsg = 'Invalid Number';

  try {
    const cleanValue = value.trim();

    let phoneNumber;

    // If it starts with '01', we need to add BD country code for parsing
    if (cleanValue.startsWith('01')) {
      phoneNumber = parsePhoneNumberWithError(cleanValue, 'BD');
    }
    // If it starts with '880' without +, add + for parsing
    else if (cleanValue.startsWith('880') && !cleanValue.startsWith('+')) {
      phoneNumber = parsePhoneNumberWithError('+' + cleanValue);
    }
    // If it starts with '+880', parse as is
    else if (cleanValue.startsWith('+880')) {
      phoneNumber = parsePhoneNumberWithError(cleanValue);
    }
    // Otherwise, try parsing with BD country code
    else {
      phoneNumber = parsePhoneNumberWithError(cleanValue, 'BD');
    }

    // Validate that it's a valid phone number
    if (!phoneNumber || !phoneNumber.isValid()) {
      return invalidMsg;
    }

    // Ensure it's a Bangladesh number
    if (phoneNumber.country !== 'BD') {
      return invalidMsg;
    }

    // Get the national number (without country code)
    // For BD, this will be 10 digits like "1712345678"
    const nationalNumber = phoneNumber.nationalNumber;

    // BD mobile numbers should be 10 digits starting with 1
    // (the full number with leading 0 is 11 digits: 01712345678)
    if (!nationalNumber.startsWith('1') || nationalNumber.length !== 10) {
      return invalidMsg;
    }

    return true;
  } catch (_error) {
    return invalidMsg;
  }
}

/**
 * Normalizes a Bangladesh phone number to 11-digit format starting with 01
 * Accepts formats like: +8801712345678, 8801712345678, 01712345678, 0171-234-5678, 0171 234 5678
 * @param value - The phone number string to normalize
 * @returns Normalized phone number (e.g., 01712345678) or null if invalid
 */
export function normalizeBangladeshPhone(value: string): string | null {
  if (!value || value.trim() === '') {
    return null;
  }

  try {
    const cleanValue = value.trim();

    let phoneNumber;

    // If it starts with '01', we need to add BD country code for parsing
    if (cleanValue.startsWith('01')) {
      phoneNumber = parsePhoneNumberWithError(cleanValue, 'BD');
    }
    // If it starts with '880' without +, add + for parsing
    else if (cleanValue.startsWith('880') && !cleanValue.startsWith('+')) {
      phoneNumber = parsePhoneNumberWithError('+' + cleanValue);
    }
    // If it starts with '+880', parse as is
    else if (cleanValue.startsWith('+880')) {
      phoneNumber = parsePhoneNumberWithError(cleanValue);
    }
    // Otherwise, try parsing with BD country code
    else {
      phoneNumber = parsePhoneNumberWithError(cleanValue, 'BD');
    }

    // Validate that it's a valid phone number
    if (
      !phoneNumber ||
      !phoneNumber.isValid() ||
      phoneNumber.country !== 'BD'
    ) {
      return null;
    }

    // Get the national number (without country code)
    // For BD, this will be 10 digits like "1712345678"
    const nationalNumber = phoneNumber.nationalNumber;

    // BD mobile numbers should be 10 digits starting with 1
    if (!nationalNumber.startsWith('1') || nationalNumber.length !== 10) {
      return null;
    }

    // Return with leading 0 to make it 11 digits (01712345678)
    return '0' + nationalNumber;
  } catch (_error) {
    return null;
  }
}

/**
 * Checks if a value is a valid Bangladesh phone number
 * @param value - The phone number string to check
 * @returns true if valid, false otherwise
 */
export function isBangladeshPhone(value: string): boolean {
  return validateBangladeshPhone(value) === true;
}
