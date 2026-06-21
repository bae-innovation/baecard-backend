import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.number(),
  product_id: z.coerce.number().nullable().optional(),
  user_id: z.coerce.number().nullable().optional(),
  name: z.string(),
  email: z.string().email(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().nullable().optional(),
  body: z.string(),
  is_visible: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  product: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .optional(),
  user: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .optional(),
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewFormSchema = z.object({
  product_id: z.coerce.number().optional().or(z.literal('')),
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required'),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(255).optional().or(z.literal('')),
  body: z.string().min(1, 'Review body is required').max(5000),
  is_visible: z.boolean().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
