// Safe methods only (no PUT/DELETE to avoid duplicate side effects)
export const RETRY_METHODS = ['GET', 'HEAD', 'OPTIONS', 'TRACE'] as const;
export const RETRY_STATUS_CODES = [408, 413, 429, 500, 502, 503, 504] as const;

// Retry configuration constants
export const RETRY_LIMIT = 3;
export const RETRY_INITIAL_DELAY = 1000; // 1 second in milliseconds
export const RETRY_MAX_DELAY = 8000; // 8 seconds in milliseconds
export const RETRY_BACKOFF_MULTIPLIER = 2;

// Default request timeout (callers can override per request)
export const REQUEST_TIMEOUT_MS = 60_000; // 60 seconds
