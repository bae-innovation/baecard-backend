import type { PaginationState } from '@tanstack/react-table';

import {
  orderSchema,
  type OrderFormValues,
  type PaymentFormValues,
} from '@/features/orders/schemas/order.schema';
import { baecardApiClient } from '@/lib/api';
import { parsePaginatedResponse, parseResponse } from '@/utils/api-validation';
import { tablePaginationToLaravel } from '@/utils/pagination';

export const ordersQueryKeys = {
  all: ['orders'] as const,
  list: (pagination: PaginationState) =>
    [...ordersQueryKeys.all, 'list', pagination] as const,
  detail: (id: number) => [...ordersQueryKeys.all, 'detail', id] as const,
};

export async function fetchOrders(pagination: PaginationState) {
  const raw = await baecardApiClient
    .get('order/list', { searchParams: tablePaginationToLaravel(pagination) })
    .json();
  return parsePaginatedResponse(raw, orderSchema);
}

export async function fetchOrder(id: number) {
  const raw = await baecardApiClient.get(`order/show/${id}`).json();
  return parseResponse(raw, orderSchema);
}

export async function createOrder(payload: OrderFormValues) {
  const body = {
    ...payload,
    product_id: payload.product_id || undefined,
    discount_value: payload.discount_value || 0,
    tax: payload.tax || 0,
    shipping_cost: payload.shipping_cost || 0,
    discount_code: payload.discount_code || undefined,
    notes: payload.notes || undefined,
  };
  const raw = await baecardApiClient.post('order/create', { json: body }).json();
  return parseResponse(raw, orderSchema);
}

export async function updateOrder(id: number, payload: Partial<OrderFormValues>) {
  const raw = await baecardApiClient.put(`order/update/${id}`, { json: payload }).json();
  return parseResponse(raw, orderSchema);
}

export async function addOrderPayment(id: number, payload: PaymentFormValues) {
  const raw = await baecardApiClient
    .post(`order/add-payment/${id}`, { json: payload })
    .json();
  return parseResponse(raw, orderSchema);
}

export async function deleteOrder(id: number) {
  const raw = await baecardApiClient.delete(`order/delete/${id}`).json();
  return parseResponse(raw, orderSchema.nullable());
}
