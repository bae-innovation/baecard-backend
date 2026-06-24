import { z } from 'zod';

import { roleSchema } from '@/features/roles/schemas/role.schema';

export const adminUserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  avatar_url: z.string().nullable().optional(),
  email_verified_at: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  roles: z.array(roleSchema).optional().default([]),
});

export type AdminUser = z.infer<typeof adminUserSchema>;

export function getUserRoleNames(user: AdminUser): string[] {
  return user.roles?.map((role) => role.name) ?? [];
}

export const createUserFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255),
    password_confirmation: z
      .string()
      .min(1, 'Confirm your password'),
    phone: z.string().max(20).optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export const updateUserFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  phone: z.string().max(20).optional().or(z.literal('')),
});

export const assignRoleFormSchema = z.object({
  role: z.string().min(1, 'Select a role'),
});

export type CreateUserFormValues = z.infer<typeof createUserFormSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserFormSchema>;
export type AssignRoleFormValues = z.infer<typeof assignRoleFormSchema>;

export const createStaffUserFormSchema = z
  .object({
    name: z.string().min(1, 'Name is required').max(255),
    email: z.string().min(1, 'Email is required').email('Enter a valid email'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(255),
    password_confirmation: z.string().min(1, 'Confirm your password'),
    phone: z.string().max(20).optional().or(z.literal('')),
    role: z.string().min(1, 'Select a role'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });

export type CreateStaffUserFormValues = z.infer<typeof createStaffUserFormSchema>;
