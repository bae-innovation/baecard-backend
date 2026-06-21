import type { PaginationState } from '@tanstack/react-table';

import {
  appointmentSchema,
  type AppointmentFormValues,
} from '@/features/appointments/schemas/appointment.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const appointmentsQueryKeys = {
  all: ['appointments'] as const,
  list: (pagination: PaginationState) =>
    [...appointmentsQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...appointmentsQueryKeys.all, 'detail', id] as const,
};

export async function fetchAppointment(id: number) {
  const raw = await baecardApiClient.get(`appointment/show/${id}`).json();
  return parseResponse(raw, appointmentSchema);
}

export async function fetchAppointments(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('appointment/list', {
      searchParams: tablePaginationToLaravel(pagination),
    })
    .json();
  return parsePaginatedResponse(raw, appointmentSchema);
}

export async function createAppointment(payload: AppointmentFormValues) {
  const body = {
    ...payload,
    customer_id: payload.customer_id || undefined,
    description: payload.description || undefined,
    location: payload.location || undefined,
    notes: payload.notes || undefined,
  };
  const raw = await baecardApiClient.post('appointment/create', { json: body }).json();
  return parseResponse(raw, appointmentSchema);
}

export async function updateAppointment(
  id: number,
  payload: Partial<AppointmentFormValues>,
) {
  const raw = await baecardApiClient
    .put(`appointment/update/${id}`, { json: payload })
    .json();
  return parseResponse(raw, appointmentSchema);
}

export async function deleteAppointment(id: number) {
  const raw = await baecardApiClient.delete(`appointment/delete/${id}`).json();
  return parseResponse(raw, appointmentSchema.nullable());
}
