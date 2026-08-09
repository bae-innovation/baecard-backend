import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import { customerSchema } from '@/features/customers/schemas/customer.schema';
import { parseResponse } from '@/utils/api-validation';
import { z } from 'zod';

const customerProfileSchema = z.object({
  id: z.number().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  social_links: z.array(
    z.object({
      platform: z.string(),
      url: z.string(),
    }),
  ).optional(),
});

const customerDetailsSchema = z.object({
  customer: customerSchema,
  profile: customerProfileSchema.nullable().optional(),
  orders: z.array(
    z.object({
      id: z.number(),
      order_number: z.string(),
      source: z.enum(['website', 'custom']).optional(),
      product_name: z.string(),
      status: z.string(),
      created_at: z.string().optional(),
      card_code: z
        .object({
          id: z.number(),
          code: z.string(),
          status: z.enum(['pending', 'published']),
          scan_url: z.string().optional(),
        })
        .nullable()
        .optional(),
      cardCode: z
        .object({
          id: z.number(),
          code: z.string(),
          status: z.enum(['pending', 'published']),
          scan_url: z.string().optional(),
        })
        .nullable()
        .optional(),
    }),
  ).optional().default([]),
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

export type { ProfileSocialLink };
