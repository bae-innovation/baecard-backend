import { z } from 'zod';

import { adminUserSchema } from '@/features/users/schemas/user.schema';

export const accountCardCodeSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.string(),
  user_id: z.number().nullable().optional(),
  profile_url: z.string().nullable().optional(),
  scan_url: z.string().optional(),
});

export const accountUserSchema = adminUserSchema.extend({
  card_code: accountCardCodeSchema.nullable().optional(),
  cardCode: accountCardCodeSchema.nullable().optional(),
});

export type AccountUser = z.infer<typeof accountUserSchema>;
export type AccountCardCode = z.infer<typeof accountCardCodeSchema>;

export const updateAccountFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export const updateAccountPasswordFormSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255),
    password_confirmation: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type UpdateAccountFormValues = z.infer<typeof updateAccountFormSchema>;
export type UpdateAccountPasswordFormValues = z.infer<
  typeof updateAccountPasswordFormSchema
>;
