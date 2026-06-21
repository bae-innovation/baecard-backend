/**
 * Status Enums
 * Common status values used across multiple features
 */

export const COMMON_STATUS = {
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  ARCHIVED: 'archived',
  DRAFT: 'draft',
  PENDING: 'pending',
} as const;

export type CommonStatus = (typeof COMMON_STATUS)[keyof typeof COMMON_STATUS];

export const USAGE_PLATFORM = {
  ADMIN: 'admin',
  APP: 'app',
  BOTH: 'both',
} as const;

export type UsagePlatform =
  (typeof USAGE_PLATFORM)[keyof typeof USAGE_PLATFORM];
