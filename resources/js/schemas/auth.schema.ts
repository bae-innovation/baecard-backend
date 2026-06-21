import { z } from 'zod';

export const authRoleSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    guard_name: z.string().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .strip();

export type AuthRole = z.infer<typeof authRoleSchema>;

export const authUserSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string().nullable().optional(),
    email_verified_at: z.string().nullable().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    roles: z.array(authRoleSchema).optional().default([]),
  })
  .strip();

export type AuthUser = z.infer<typeof authUserSchema>;

export const backendLoginDataSchema = z.object({
  user: authUserSchema,
  token: z.string(),
});

export type BackendLoginData = z.infer<typeof backendLoginDataSchema>;

/** Normalized user stored in auth state. */
export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  avatar: z.string().optional(),
  roles: z.array(z.string()).optional(),
});

export type User = z.infer<typeof userSchema>;

export type Permission = {
  id: number;
  name: string;
};

export type Permissions = Permission[];

export type LoginPayload = BackendLoginData;

export function normalizeAuthUser(user: AuthUser): User {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone ?? undefined,
    roles: user.roles?.map((role) => role.name) ?? [],
  };
}
