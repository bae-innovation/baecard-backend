import { z } from 'zod';

import type { CustomerOption } from '@/features/orders/components/customer-picker';
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

export const orderCardSchema = z.object({
  id: z.number(),
  code: z.string(),
  status: z.enum(['pending', 'published']),
  scan_url: z.string().optional(),
});

export const customerOrderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  source: z.enum(['website', 'custom']).optional(),
  product_name: z.string(),
  status: z.string(),
  created_at: z.string().optional(),
  card_code: orderCardSchema.nullable().optional(),
  cardCode: orderCardSchema.nullable().optional(),
});

export const orderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  source: z.enum(['website', 'custom']).optional(),
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
export type CustomerOrder = z.infer<typeof customerOrderSchema>;

const newCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'Password must be at least 8 characters').optional().or(z.literal('')),
});

const looseNewCustomerSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
});

export const orderFormSchema = z
  .object({
    customer_mode: z.enum(['existing', 'new']).default('existing'),
    customer_id: z.union([z.coerce.number(), z.literal('')]).optional(),
    new_customer: looseNewCustomerSchema.optional(),
    product_id: z.union([z.coerce.number(), z.literal('')]).optional(),
    product_name: z.string().min(1, 'Product name is required'),
    unit_price: z.union([z.coerce.number().min(0), z.literal('')]),
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
  })
  .superRefine((values, ctx) => {
    if (values.customer_mode === 'existing') {
      const id = Number(values.customer_id);
      if (!values.customer_id || Number.isNaN(id) || id < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['customer_id'],
          message: 'Select a customer',
        });
      }
    }

    if (values.customer_mode === 'new') {
      const parsed = newCustomerSchema.safeParse(values.new_customer);
      if (!parsed.success) {
        parsed.error.issues.forEach((issue) => {
          ctx.addIssue({
            ...issue,
            path: ['new_customer', ...issue.path],
          });
        });
      }
    }

    if (values.unit_price === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['unit_price'],
        message: 'Unit price is required',
      });
    }
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

export type ProductOption = {
  id: number;
  name: string;
  price: number | string;
};

export type AvailableOrderOption = {
  id: number;
  order_number: string;
  source?: 'website' | 'custom';
  product_id?: number | null;
  product_name: string;
  status: string;
  created_at?: string;
};
