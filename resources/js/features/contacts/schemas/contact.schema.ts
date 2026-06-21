import { z } from 'zod';

export const contactSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  is_read: z.boolean(),
  ip_address: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Contact = z.infer<typeof contactSchema>;
