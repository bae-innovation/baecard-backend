import { z } from 'zod';

export const cardCodeUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
});

export type CardCodeUser = z.infer<typeof cardCodeUserSchema>;

export const cardCodeOrderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  source: z.enum(['website', 'custom']).optional(),
  customer_id: z.number().optional(),
});

export const cardCodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string().optional(),
  display_name: z.string().optional(),
  phone: z.string().nullable().optional(),
  status: z.enum(['pending', 'published']),
  user_id: z.number().nullable().optional(),
  order_id: z.number().nullable().optional(),
  scan_url: z.string(),
  profile_url: z.string().nullable().optional(),
  user: cardCodeUserSchema.nullable().optional(),
  order: cardCodeOrderSchema.nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CardCode = z.infer<typeof cardCodeSchema>;

export const cardCodeFormSchema = z.object({
  customer_id: z.coerce.number().min(1, 'Select a customer'),
  order_id: z.coerce.number().min(1, 'Select an order'),
  code: z
    .string()
    .min(1, 'Code is required')
    .max(8, 'Code must be at most 8 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Code must be alphanumeric'),
});

export type CardCodeFormValues = z.infer<typeof cardCodeFormSchema>;

export const generateCodeResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    code: z.string(),
  }),
});

export type GenerateCodeResponse = z.infer<typeof generateCodeResponseSchema>;

export const cardCodeAssignableUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
});

export type CardCodeAssignableUser = z.infer<typeof cardCodeAssignableUserSchema>;

export const publicProfileCardSchema = z.object({
  code: z.string(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  scan_url: z.string(),
  profile_url: z.string().nullable().optional(),
  status: z.enum(['pending', 'published']),
});

export type PublicProfileCard = z.infer<typeof publicProfileCardSchema>;

export const publicProfileUserSchema = z.object({
  name: z.string(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  email: z.string(),
  personal_email: z.string().nullable().optional(),
  personal_phone: z.string().nullable().optional(),
  personal_address: z.string().nullable().optional(),
  work_email: z.string().nullable().optional(),
  work_phone: z.string().nullable().optional(),
  work_address: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  company: z.string().nullable().optional(),
  designation: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  active_template: z.coerce.number().int().optional(),
  cover_image_url: z.string().nullable().optional(),
});

export type PublicProfileUser = z.infer<typeof publicProfileUserSchema>;

export type CardCustomerOption = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
};

export function cardDisplayName(card: CardCode): string {
  return card.display_name || card.user?.name || card.name || '—';
}
