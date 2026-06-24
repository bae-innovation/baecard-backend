import { z } from 'zod';

export const profileServiceSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string().nullable().optional(),
  price: z.coerce.number().nullable().optional(),
  image: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  is_active: z.boolean(),
  sort_order: z.number().optional(),
});

export type ProfileService = z.infer<typeof profileServiceSchema>;

export const profileServiceFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(5000).optional().or(z.literal('')),
  price: z.coerce.number().min(0).optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export type ProfileServiceFormValues = z.infer<typeof profileServiceFormSchema>;
