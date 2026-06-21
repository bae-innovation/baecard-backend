/**
 * Structured log payload types and domain/errorType enums for Axiom filtering.
 * Use these as the second argument to logger.info/error/debug/warn.
 */

export type LogDomain = 'auth' | 'api' | 'api-validation' | 'query' | 'app';

export type LogErrorType =
  | 'business_logic'
  | 'zod'
  | 'unknown'
  | 'HTTP'
  | 'Validation'
  | 'Generic';

export type AuthLogEvent =
  | 'login'
  | 'login_attempt'
  | 'login_success'
  | 'login_failed'
  | 'login_error'
  | 'logout';

export type QueryRetryEvent =
  | 'retry_attempt'
  | 'retry_stopped_non_retryable'
  | 'retry_stopped_validation'
  | 'retry_limit_exceeded';

/** Base shape: all payloads get timestamp and domain from the app logger. */
export interface BaseLogPayload {
  domain?: LogDomain;
  /** Do not set at call sites; app logger adds it. */
  timestamp?: string;
}

export interface ApiRequestLog extends BaseLogPayload {
  domain: 'api';
  method: string;
  url: string;
  hasAuth?: boolean;
  userAgent?: string;
}

export interface ApiErrorLog extends BaseLogPayload {
  domain: 'api';
  method: string;
  url: string;
  status: number;
  errorMessage: string;
  errorCode?: string;
  errorType?: LogErrorType;
}

export interface AuthLog extends BaseLogPayload {
  domain: 'auth';
  event: AuthLogEvent;
  rememberMe?: boolean;
}

export interface ValidationLog extends BaseLogPayload {
  domain: 'api-validation';
  errorType: 'business_logic' | 'zod' | 'unknown';
  errorMessage: string;
  errorPath?: string;
  errorCode?: string | number;
  errorSummary?: string;
}

export interface QueryRetryLog extends BaseLogPayload {
  domain: 'query';
  event: QueryRetryEvent;
  failureCount?: number;
  errorMessage?: string;
  errorType?: LogErrorType;
  statusCode?: number;
}

export type StructuredLogPayload =
  | ApiRequestLog
  | ApiErrorLog
  | AuthLog
  | ValidationLog
  | QueryRetryLog
  | (BaseLogPayload & Record<string, unknown>);
