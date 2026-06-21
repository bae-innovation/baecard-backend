import type { PaginationState } from '@tanstack/react-table';

import {
  roleSchema,
  type CreateRoleFormValues,
  type UpdateRoleFormValues,
} from '@/features/roles/schemas/role.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const rolesQueryKeys = {
  all: ['roles'] as const,
  list: (pagination: PaginationState) =>
    [...rolesQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...rolesQueryKeys.all, 'detail', id] as const,
};

export async function fetchRoles(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('role/list', {
      searchParams: tablePaginationToLaravel(pagination),
    })
    .json();

  return parsePaginatedResponse(raw, roleSchema);
}

export async function fetchRole(id: number) {
  const raw = await baecardApiClient.get(`role/show/${id}`).json();
  return parseResponse(raw, roleSchema);
}

export async function createRole(payload: CreateRoleFormValues) {
  const raw = await baecardApiClient
    .post('role/create', { json: payload })
    .json();
  return parseResponse(raw, roleSchema);
}

export async function updateRole(id: number, payload: UpdateRoleFormValues) {
  const raw = await baecardApiClient
    .put(`role/update/${id}`, { json: payload })
    .json();
  return parseResponse(raw, roleSchema);
}

export async function deleteRole(id: number) {
  const raw = await baecardApiClient.delete(`role/delete/${id}`).json();
  return parseResponse(raw, roleSchema.nullable());
}
