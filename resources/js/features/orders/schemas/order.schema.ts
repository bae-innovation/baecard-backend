import { z } from 'zod';

import { coerceFormattedNumber } from '@/utils/api-validation';

export const paymentSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  amount: coerceFormattedNumber(),
  payment_method: z.enum(['cash', 'bank_transfer', 'card', 'online']),
  reference_number: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  paid_at: z.string(),
  created_at: z.string().optional(),
});

export const orderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  customer_id: z.coerce.number(),
  product_id: z.coerce.number().nullable().optional(),
  product_name: z.string(),
  unit_price: coerceFormattedNumber(),
  quantity: z.coerce.number().int(),
  status: z.enum([
    'pending',
    'processing',
    'confirmed',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
  ]),
  payment_status: z.enum([
    'pending',
    'paid',
    'partially_paid',
    'overdue',
    'refunded',
  ]),
  subtotal: coerceFormattedNumber(),
  discount_type: z.enum(['percentage', 'fixed', 'coupon']).nullable().optional(),
  discount_value: coerceFormattedNumber().optional(),
  discount_code: z.string().nullable().optional(),
  tax: coerceFormattedNumber().optional(),
  shipping_cost: coerceFormattedNumber().optional(),
  total: coerceFormattedNumber(),
  paid_amount: coerceFormattedNumber().optional(),
  due_amount: coerceFormattedNumber().optional(),
  notes: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  customer: z
    .object({
      id: z.number(),
      name: z.string(),
      email: z.string().email(),
      phone: z.string().nullable().optional(),
    })
    .optional(),
  product: z
    .object({ id: z.number(), name: z.string(), price: coerceFormattedNumber().nullable().optional() })
    .nullable()
    .optional(),
  payments: z.array(paymentSchema).optional().default([]),
});

export type Order = z.infer<typeof orderSchema>;
export type Payment = z.infer<typeof paymentSchema>;

export const orderFormSchema = z.object({
  customer_id: z.coerce.number().min(1, 'Customer is required'),
  product_id: z.coerce.number().optional().or(z.literal('')),
  product_name: z.string().min(1, 'Product name is required'),
  unit_price: z.coerce.number().min(0),
  quantity: z.coerce.number().int().min(1).default(1),
  status: z
    .enum([
      'pending',
      'processing',
      'confirmed',
      'shipped',
      'delivered',
      'cancelled',
      'refunded',
    ])
    .optional(),
  discount_type: z.enum(['percentage', 'fixed', 'coupon']).optional(),
  discount_value: z.coerce.number().min(0).optional().or(z.literal('')),
  discount_code: z.string().optional().or(z.literal('')),
  tax: z.coerce.number().min(0).optional().or(z.literal('')),
  shipping_cost: z.coerce.number().min(0).optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

export const paymentFormSchema = z.object({
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  payment_method: z.enum(['cash', 'bank_transfer', 'card', 'online']),
  reference_number: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
  paid_at: z.string().optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;
export type PaymentFormValues = z.infer<typeof paymentFormSchema>;
