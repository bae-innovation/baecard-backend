import { z } from 'zod';

export const customerSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  email_verified_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Customer = z.infer<typeof customerSchema>;

export const createCustomerFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255),
    password_confirmation: z.string().min(1, 'Confirm your password'),
    phone: z.string().max(20).optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const updateCustomerFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export type CreateCustomerFormValues = z.infer<typeof createCustomerFormSchema>;
export type UpdateCustomerFormValues = z.infer<typeof updateCustomerFormSchema>;
