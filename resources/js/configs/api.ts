/**
 * API Constants
 * API versions and base configuration
 * Note: API endpoints remain as hardcoded strings in API files
 */

// API Versions
export const API_VERSIONS = {
  V1: 'v1',
  V2: 'v2',
} as const;

export type ApiVersion = (typeof API_VERSIONS)[keyof typeof API_VERSIONS];

export const DEFAULT_API_VERSION = API_VERSIONS.V1;
