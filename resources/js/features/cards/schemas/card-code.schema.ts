import { z } from 'zod';

export const cardCodeUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().optional(),
  phone: z.string().nullable().optional(),
});

export type CardCodeUser = z.infer<typeof cardCodeUserSchema>;

export const cardCodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  phone: z.string().nullable().optional(),
  status: z.enum(['pending', 'published']),
  user_id: z.number().nullable().optional(),
  scan_url: z.string(),
  profile_url: z.string().nullable().optional(),
  user: cardCodeUserSchema.nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CardCode = z.infer<typeof cardCodeSchema>;

export const cardCodeFormSchema = z.object({
  code: z
    .string()
    .min(1, 'Code is required')
    .max(8, 'Code must be at most 8 characters')
    .regex(/^[A-Za-z0-9]+$/, 'Code must be alphanumeric'),
  name: z.string().min(1, 'Name is required').max(255),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export type CardCodeFormValues = z.infer<typeof cardCodeFormSchema>;

export const generateCodeResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    code: z.string(),
  }),
});

export type GenerateCodeResponse = z.infer<typeof generateCodeResponseSchema>;

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
  email: z.string(),
  phone: z.string().nullable().optional(),
});

export type PublicProfileUser = z.infer<typeof publicProfileUserSchema>;
