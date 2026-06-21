import type { PaginationState } from '@tanstack/react-table';

import {
  productSchema,
  type ProductFormValues,
} from '@/features/products/schemas/product.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const productsQueryKeys = {
  all: ['products'] as const,
  list: (pagination: PaginationState) =>
    [...productsQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...productsQueryKeys.all, 'detail', id] as const,
};

function buildProductFormData(values: ProductFormValues, image?: File | null) {
  const formData = new FormData();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    if (typeof value === 'boolean') {
      formData.append(key, value ? '1' : '0');
      return;
    }
    formData.append(key, String(value));
  });

  if (image) {
    formData.append('image', image);
  }

  return formData;
}

export async function fetchProducts(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('product/list', { searchParams: tablePaginationToLaravel(pagination) })
    .json();
  return parsePaginatedResponse(raw, productSchema);
}

export async function fetchProduct(id: number) {
  const raw = await baecardApiClient.get(`product/show/${id}`).json();
  return parseResponse(raw, productSchema);
}

export async function createProduct(values: ProductFormValues, image?: File | null) {
  const raw = await baecardApiClient
    .post('product/create', { body: buildProductFormData(values, image) })
    .json();
  return parseResponse(raw, productSchema);
}

export async function updateProduct(
  id: number,
  values: ProductFormValues,
  image?: File | null,
) {
  const raw = await baecardApiClient
    .post(`product/update/${id}`, { body: buildProductFormData(values, image) })
    .json();
  return parseResponse(raw, productSchema);
}

export async function deleteProduct(id: number) {
  const raw = await baecardApiClient.delete(`product/delete/${id}`).json();
  return parseResponse(raw, productSchema.nullable());
}
