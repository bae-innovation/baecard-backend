import { z } from 'zod';

import {
  cardCodeAssignableUserSchema,
  type CardCodeAssignableUser,
} from '@/features/cards/schemas/card-code.schema';
import { parseResponse } from '@/utils/api-validation';

const assignableUsersSchema = z.array(cardCodeAssignableUserSchema);

export async function searchCardCodeUsers(params: {
  email?: string;
  phone?: string;
}): Promise<CardCodeAssignableUser[]> {
  const searchParams = new URLSearchParams();

  if (params.email?.trim()) {
    searchParams.set('email', params.email.trim());
  }

  if (params.phone?.trim()) {
    searchParams.set('phone', params.phone.trim());
  }

  const response = await fetch(`/cards/search-users?${searchParams.toString()}`, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String(body.message)
        : 'Failed to search users';
    throw new Error(message);
  }

  const payload = await response.json();

  return parseResponse(payload, assignableUsersSchema);
}
