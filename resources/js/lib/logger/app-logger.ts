import { useMemo } from 'react';

import { axiomLogger } from '@/lib/axiom';

import { redactPII } from './redact-pii';
import type { LogDomain, StructuredLogPayload } from './types';

const DEFAULT_DOMAIN: LogDomain = 'app';

function preparePayload(
  payload: Record<string, unknown> | undefined,
): Record<string, unknown> {
  const merged: Record<string, unknown> = {
    ...payload,
    timestamp: new Date().toISOString(),
    domain: payload?.domain ?? DEFAULT_DOMAIN,
  };
  return redactPII(merged) as Record<string, unknown>;
}

function log(
  level: 'info' | 'error' | 'debug' | 'warn',
  message: string,
  payload?: StructuredLogPayload | Record<string, unknown>,
) {
  const safe = preparePayload(payload as Record<string, unknown> | undefined);
  axiomLogger[level](message, safe);
}

const appLogger = {
  info: (
    message: string,
    payload?: StructuredLogPayload | Record<string, unknown>,
  ) => log('info', message, payload),
  error: (
    message: string,
    payload?: StructuredLogPayload | Record<string, unknown>,
  ) => log('error', message, payload),
  debug: (
    message: string,
    payload?: StructuredLogPayload | Record<string, unknown>,
  ) => log('debug', message, payload),
  warn: (
    message: string,
    payload?: StructuredLogPayload | Record<string, unknown>,
  ) => log('warn', message, payload),
};

export { appLogger as logger };

/**
 * React hook that returns the app logger. Use in components and custom hooks
 * so all logs go through redaction, auto-timestamp, and domain.
 */
export function useAppLogger() {
  return useMemo(() => appLogger, []);
}
