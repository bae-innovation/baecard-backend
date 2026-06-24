import { customerSocialSchema } from '@/features/customer-socials/schemas/customer-social.schema';
import { customerSchema } from '@/features/customers/schemas/customer.schema';
import { parseResponse } from '@/utils/api-validation';
import { z } from 'zod';

const customerDetailsSchema = z.object({
  customer: customerSchema,
  socials: z.array(customerSocialSchema),
});

export type CustomerDetails = z.infer<typeof customerDetailsSchema>;

export async function fetchCustomerDetails(
  customerId: number,
): Promise<CustomerDetails> {
  const response = await fetch(`/customers/${customerId}`, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch customer details');
  }

  const payload = await response.json();

  return parseResponse(payload, customerDetailsSchema);
}
