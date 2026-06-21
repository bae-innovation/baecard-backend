import type { PaginationState } from '@tanstack/react-table';

import { contactSchema } from '@/features/contacts/schemas/contact.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const contactsQueryKeys = {
  all: ['contacts'] as const,
  list: (pagination: PaginationState) =>
    [...contactsQueryKeys.all, 'list', pagination] as const,
};

export async function fetchContacts(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('contact/list', { searchParams: tablePaginationToLaravel(pagination) })
    .json();
  return parsePaginatedResponse(raw, contactSchema);
}

export async function markContactRead(id: number) {
  const raw = await baecardApiClient.patch(`contact/mark-read/${id}`).json();
  return parseResponse(raw, contactSchema);
}

export async function deleteContact(id: number) {
  const raw = await baecardApiClient.delete(`contact/delete/${id}`).json();
  return parseResponse(raw, contactSchema.nullable());
}
