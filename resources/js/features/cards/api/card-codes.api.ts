import { z } from 'zod';

import {
  cardCodeAssignableUserSchema,
  type CardCodeAssignableUser,
} from '@/features/cards/schemas/card-code.schema';
import type { AvailableOrderOption } from '@/features/orders/schemas/order.schema';
import { parseResponse } from '@/utils/api-validation';

const assignableUsersSchema = z.array(cardCodeAssignableUserSchema);

const availableOrdersSchema = z.array(
  z.object({
    id: z.number(),
    order_number: z.string(),
    source: z.enum(['website', 'custom']).optional(),
    product_id: z.number().nullable().optional(),
    product_name: z.string(),
    status: z.string(),
    created_at: z.string().optional(),
  }),
);

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

export async function fetchAvailableOrders(
  customerId: number,
): Promise<AvailableOrderOption[]> {
  const response = await fetch(
    `/cards/available-orders?customer_id=${customerId}`,
    {
      headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      credentials: 'same-origin',
    },
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message =
      body && typeof body === 'object' && 'message' in body
        ? String(body.message)
        : 'Failed to load orders';
    throw new Error(message);
  }

  const payload = await response.json();

  return parseResponse(payload, availableOrdersSchema);
}
