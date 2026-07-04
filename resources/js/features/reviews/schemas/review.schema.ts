import { z } from 'zod';

export const reviewSchema = z.object({
  id: z.number(),
  user_id: z.coerce.number().nullable().optional(),
  name: z.string(),
  email: z.string().email(),
  image_url: z.string().nullable().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().nullable().optional(),
  body: z.string(),
  is_visible: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  user: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .optional(),
});

export type Review = z.infer<typeof reviewSchema>;

export const reviewFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Valid email is required'),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(255).optional().or(z.literal('')),
  body: z.string().min(1, 'Review body is required').max(5000),
  is_visible: z.boolean().optional(),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export function serializeReviewFormPayload(
  values: ReviewFormValues,
  mode: 'create' | 'edit',
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    name: values.name,
    email: values.email,
    rating: Number(values.rating),
    body: values.body,
  };

  if (values.title) {
    payload.title = values.title;
  }

  if (mode === 'edit' && values.is_visible !== undefined) {
    payload.is_visible = values.is_visible;
  }

  return payload;
}
