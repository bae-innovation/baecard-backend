import { z } from 'zod';

export const customerSocialSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  platform: z.enum([
    'whatsapp',
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'tiktok',
    'youtube',
    'snapchat',
    'other',
  ]),
  platform_value: z.string(),
  url: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  fn: z.string().nullable().optional(),
  is_primary: z.boolean().optional(),
  sort_order: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CustomerSocial = z.infer<typeof customerSocialSchema>;

export const customerSocialFormSchema = z.object({
  customer_id: z.coerce.number().min(1),
  platform: z.enum([
    'whatsapp',
    'facebook',
    'instagram',
    'twitter',
    'linkedin',
    'tiktok',
    'youtube',
    'snapchat',
    'other',
  ]),
  platform_value: z.string().min(1, 'Platform value is required'),
  url: z.string().optional().or(z.literal('')),
  label: z.string().optional().or(z.literal('')),
  fn: z.string().optional().or(z.literal('')),
  is_primary: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export type CustomerSocialFormValues = z.infer<typeof customerSocialFormSchema>;
