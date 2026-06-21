import {
  customerSocialSchema,
  type CustomerSocialFormValues,
} from '@/features/customer-socials/schemas/customer-social.schema';
import { baecardApiClient } from '@/lib/api';
import { parseResponse } from '@/utils/api-validation';
import { z } from 'zod';

export const customerSocialsQueryKeys = {
  all: ['customer-socials'] as const,
  list: (customerId: number) =>
    [...customerSocialsQueryKeys.all, 'list', customerId] as const,
};

export async function fetchCustomerSocials(customerId: number) {
  const raw = await baecardApiClient
    .get(`customer-social/list/${customerId}`)
    .json();
  return parseResponse(raw, z.array(customerSocialSchema));
}

export async function createCustomerSocial(payload: CustomerSocialFormValues) {
  const raw = await baecardApiClient
    .post('customer-social/create', { json: payload })
    .json();
  return parseResponse(raw, customerSocialSchema);
}

export async function updateCustomerSocial(
  id: number,
  payload: Partial<CustomerSocialFormValues>,
) {
  const raw = await baecardApiClient
    .put(`customer-social/update/${id}`, { json: payload })
    .json();
  return parseResponse(raw, customerSocialSchema);
}

export async function deleteCustomerSocial(id: number) {
  const raw = await baecardApiClient
    .delete(`customer-social/delete/${id}`)
    .json();
  return parseResponse(raw, customerSocialSchema.nullable());
}
