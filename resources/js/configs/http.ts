/**
 * HTTP Constants
 * Centralized HTTP-related constants including status codes, headers, and content types
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  TOO_MANY_REQUESTS: 429,
  REQUEST_TIMEOUT: 408,
  PAYLOAD_TOO_LARGE: 413,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

// HTTP Headers
export const HTTP_HEADERS = {
  ACCEPT: 'Accept',
  AUTHORIZATION: 'Authorization',
  CONTENT_TYPE: 'Content-Type',
  RETRY_AFTER: 'Retry-After',
} as const;

// Authentication Schemes
export const AUTH_SCHEMES = {
  BEARER: 'Bearer',
} as const;

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
} as const;
