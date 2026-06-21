import type { PaginationState } from '@tanstack/react-table';

import {
  adminUserSchema,
  type AssignRoleFormValues,
  type CreateUserFormValues,
  type UpdateUserFormValues,
} from '@/features/users/schemas/user.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const usersQueryKeys = {
  all: ['users'] as const,
  list: (pagination: PaginationState) =>
    [...usersQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...usersQueryKeys.all, 'detail', id] as const,
};

export async function fetchUsers(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('user/list', {
      searchParams: tablePaginationToLaravel(pagination),
    })
    .json();

  return parsePaginatedResponse(raw, adminUserSchema);
}

export async function fetchUser(id: number) {
  const raw = await baecardApiClient.get(`user/show/${id}`).json();
  return parseResponse(raw, adminUserSchema);
}

export async function createUser(payload: CreateUserFormValues) {
  const body = {
    name: payload.name,
    email: payload.email,
    password: payload.password,
    password_confirmation: payload.password_confirmation,
    phone: payload.phone?.trim() ? payload.phone.trim() : undefined,
    role: 'User',
  };

  const raw = await baecardApiClient.post('user/create', { json: body }).json();
  return parseResponse(raw, adminUserSchema);
}

export async function updateUser(id: number, payload: UpdateUserFormValues) {
  const body = {
    ...payload,
    phone: payload.phone?.trim() ? payload.phone.trim() : null,
  };

  const raw = await baecardApiClient
    .put(`user/update/${id}`, { json: body })
    .json();
  return parseResponse(raw, adminUserSchema);
}

export async function assignUserRole(
  id: number,
  payload: AssignRoleFormValues,
) {
  const raw = await baecardApiClient
    .patch(`user/assign-role/${id}`, { json: payload })
    .json();
  return parseResponse(raw, adminUserSchema);
}

export async function deleteUser(id: number) {
  const raw = await baecardApiClient.delete(`user/delete/${id}`).json();
  return parseResponse(raw, adminUserSchema.nullable());
}
