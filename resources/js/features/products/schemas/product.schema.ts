import { z } from 'zod';

import { coerceFormattedNumber } from '@/utils/api-validation';

export const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  sku: z.string().nullable().optional(),
  price: coerceFormattedNumber().nullable().optional(),
  discount_type: z.enum(['percentage', 'fixed']).nullable().optional(),
  discount_value: coerceFormattedNumber().nullable().optional(),
  stock_quantity: z.coerce.number().int().nullable().optional(),
  image: z.string().nullable().optional(),
  image_url: z.string().nullable().optional(),
  images: z.array(z.string()).nullable().optional(),
  nfc_type: z.string().nullable().optional(),
  weight: coerceFormattedNumber().nullable().optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  meta_title: z.string().nullable().optional(),
  meta_description: z.string().nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;

export const productFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  slug: z.string().max(255).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  short_description: z.string().max(500).optional().or(z.literal('')),
  sku: z.string().max(100).optional().or(z.literal('')),
  price: z.coerce.number().min(0).optional().or(z.literal('')),
  discount_type: z.enum(['percentage', 'fixed']).optional(),
  discount_value: z.coerce.number().min(0).optional().or(z.literal('')),
  stock_quantity: z.coerce.number().int().min(0).optional().or(z.literal('')),
  nfc_type: z.string().max(100).optional().or(z.literal('')),
  weight: z.coerce.number().min(0).optional().or(z.literal('')),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  meta_title: z.string().max(255).optional().or(z.literal('')),
  meta_description: z.string().max(500).optional().or(z.literal('')),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
