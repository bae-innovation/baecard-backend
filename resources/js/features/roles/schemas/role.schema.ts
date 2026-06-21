import { z } from 'zod';

export const roleSchema = z.object({
  id: z.number(),
  name: z.string(),
  guard_name: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Role = z.infer<typeof roleSchema>;

export const createRoleFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Role name is required')
    .max(255, 'Role name must be 255 characters or less'),
});

export const updateRoleFormSchema = createRoleFormSchema;

export type CreateRoleFormValues = z.infer<typeof createRoleFormSchema>;
export type UpdateRoleFormValues = z.infer<typeof updateRoleFormSchema>;
