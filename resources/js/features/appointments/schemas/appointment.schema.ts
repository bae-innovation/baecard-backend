import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.number(),
  customer_id: z.coerce.number(),
  title: z.string(),
  description: z.string().nullable().optional(),
  appointment_date: z.string(),
  duration_minutes: z.coerce.number().int(),
  status: z.enum([
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'rescheduled',
  ]),
  location: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  customer: z
    .object({ id: z.number(), name: z.string(), email: z.string().email() })
    .optional(),
});

export type Appointment = z.infer<typeof appointmentSchema>;

export const appointmentFormSchema = z.object({
  customer_id: z.coerce.number().optional().or(z.literal('')),
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional().or(z.literal('')),
  appointment_date: z.string().min(1, 'Date is required'),
  duration_minutes: z.coerce.number().int().min(15).default(60),
  status: z
    .enum(['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'])
    .optional(),
  location: z.string().max(255).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;
