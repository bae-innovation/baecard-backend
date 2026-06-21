import {
  cardListResponseSchema,
  businessCardSchema,
  generateCardResponseSchema,
} from '@/features/cards/schemas/card.schema';
import { baecardApiClient } from '@/lib/api';
import { parseResponse } from '@/utils/api-validation';

export const cardsQueryKeys = {
  all: ['cards'] as const,
  list: () => [...cardsQueryKeys.all, 'list'] as const,
};

export async function fetchCards() {
  const raw = await baecardApiClient
    .get('admin/dashboard/card/list')
    .json();
  return parseResponse(raw, cardListResponseSchema);
}

export async function generateCard(userId: number) {
  const raw = await baecardApiClient
    .post(`admin/dashboard/card/generate/${userId}`)
    .json();
  return parseResponse(raw, generateCardResponseSchema);
}

export async function regenerateCard(userId: number) {
  const raw = await baecardApiClient
    .post(`admin/dashboard/card/regenerate/${userId}`)
    .json();
  return parseResponse(raw, businessCardSchema);
}
