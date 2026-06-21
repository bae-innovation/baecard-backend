import type { PaginationState } from '@tanstack/react-table';

import {
  vendorSchema,
  type VendorFormValues,
} from '@/features/vendors/schemas/vendor.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const vendorsQueryKeys = {
  all: ['vendors'] as const,
  list: (pagination: PaginationState) =>
    [...vendorsQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...vendorsQueryKeys.all, 'detail', id] as const,
};

export async function fetchVendor(id: number) {
  const raw = await baecardApiClient.get(`vendor/show/${id}`).json();
  return parseResponse(raw, vendorSchema);
}

function buildVendorFormData(values: VendorFormValues, image?: File | null) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }
    formData.append(key, String(value));
  });
  if (image) formData.append('image', image);
  return formData;
}

export async function fetchVendors(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('vendor/list', { searchParams: tablePaginationToLaravel(pagination) })
    .json();
  return parsePaginatedResponse(raw, vendorSchema);
}

export async function createVendor(values: VendorFormValues, image?: File | null) {
  const raw = await baecardApiClient
    .post('vendor/create', { body: buildVendorFormData(values, image) })
    .json();
  return parseResponse(raw, vendorSchema);
}

export async function updateVendor(
  id: number,
  values: VendorFormValues,
  image?: File | null,
) {
  const raw = await baecardApiClient
    .post(`vendor/update/${id}`, { body: buildVendorFormData(values, image) })
    .json();
  return parseResponse(raw, vendorSchema);
}

export async function deleteVendor(id: number) {
  const raw = await baecardApiClient.delete(`vendor/delete/${id}`).json();
  return parseResponse(raw, vendorSchema.nullable());
}
