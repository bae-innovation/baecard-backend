import { z } from 'zod';

export const contactMetadataSchema = z
  .object({
    product_id: z.number().optional(),
    product_name: z.string().optional(),
    job_title: z.string().optional(),
    company: z.string().optional(),
    card_amount: z.string().optional(),
    vendor_slug: z.string().optional(),
  })
  .nullable()
  .optional();

export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  subject: z.enum(['message', 'order', 'corporate']).nullable().optional(),
  message: z.string().nullable().optional(),
  metadata: contactMetadataSchema,
  is_read: z.boolean(),
  ip_address: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Contact = z.infer<typeof contactSchema>;

export type ContactMetadata = z.infer<typeof contactMetadataSchema>;
