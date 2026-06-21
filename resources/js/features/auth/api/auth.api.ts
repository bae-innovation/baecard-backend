import { z } from 'zod';

import type {
  ForgotPasswordFormValues,
  LoginFormValues,
  ResetPasswordFormValues,
} from '@/features/auth/schemas/auth-forms.schema';
import { baecardApiClient } from '@/lib/api';
import {
  authUserSchema,
  backendLoginDataSchema,
  type BackendLoginData,
} from '@/schemas/auth.schema';
import { parseResponse } from '@/utils/api-validation';

export async function login(payload: LoginFormValues): Promise<BackendLoginData> {
  const raw = await baecardApiClient
    .post('auth/login', { json: payload })
    .json();
  return parseResponse(raw, backendLoginDataSchema);
}

export async function logoutApi(): Promise<void> {
  try {
    const raw = await baecardApiClient.post('auth/logout').json();
    parseResponse(raw, z.null().nullable());
  } catch {
    // Ignore network errors during logout — local session is cleared regardless.
  }
}

export async function forgotPassword(
  payload: ForgotPasswordFormValues,
): Promise<void> {
  const raw = await baecardApiClient
    .post('auth/forgot-password', { json: payload })
    .json();
  parseResponse(raw, z.null().nullable());
}

export async function resetPassword(
  payload: ResetPasswordFormValues,
): Promise<void> {
  const raw = await baecardApiClient
    .post('auth/reset-password', {
      json: {
        email: payload.email,
        token: payload.token,
        password: payload.password,
      },
    })
    .json();
  parseResponse(raw, z.null().nullable());
}

export async function fetchMe() {
  const raw = await baecardApiClient.get('auth/me').json();
  return parseResponse(raw, authUserSchema);
}
