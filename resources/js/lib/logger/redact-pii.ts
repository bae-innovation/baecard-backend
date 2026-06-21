/**
 * PII (Personally Identifiable Information) redaction for logger payloads.
 * Used to avoid sending user data to Axiom for privacy/compliance (e.g. GDPR).
 *
 * Redacted keys are listed in PII_KEYS. Add project-specific identifiers there.
 */

export const PII_REDACTED_PLACEHOLDER = '[REDACTED]';

/** Keys whose values are redacted before logging. Add project-specific PII field names here. */
const PII_KEYS_LIST = [
  'userEmail',
  'userName',
  'userId',
  'emailOrPhone',
  'email',
  'phone',
  'password',
  'access_token',
  'accessToken',
  'token',
  'refresh_token',
  'refreshToken',
  'authorization',
  'name',
  'firstName',
  'lastName',
  'address',
  'phoneNumber',
  'mobile',
] as const;

export const PII_KEYS = new Set<string>(PII_KEYS_LIST);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

/**
 * Recursively redacts known PII keys in an object. Returns a deep copy with
 * PII values replaced by PII_REDACTED_PLACEHOLDER. Does not mutate the original.
 *
 * - Plain objects and arrays are traversed recursively.
 * - Keys in PII_KEYS get their value replaced.
 * - Primitives, null, Date, Error, and other non-plain objects are returned as-is.
 */
export function redactPII<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => redactPII(item)) as T;
  }

  if (obj instanceof Date || obj instanceof Error) {
    return obj;
  }

  if (!isPlainObject(obj)) {
    return obj;
  }

  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const isPII = PII_KEYS.has(key);
    if (isPII) {
      out[key] = PII_REDACTED_PLACEHOLDER;
    } else {
      out[key] = redactPII(value);
    }
  }
  return out as T;
}
