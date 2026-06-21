import { z } from 'zod';

export const cardUserSummarySchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable().optional(),
  roles: z.array(z.string()),
});

export type CardUserSummary = z.infer<typeof cardUserSummarySchema>;

export const generatedCardSchema = cardUserSummarySchema.extend({
  uid: z.string(),
  card_url: z.string(),
});

export type GeneratedCard = z.infer<typeof generatedCardSchema>;

export const cardListResponseSchema = z.object({
  generated: z.array(generatedCardSchema),
  not_generated: z.array(cardUserSummarySchema),
});

export type CardListResponse = z.infer<typeof cardListResponseSchema>;

export const businessCardSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  uid: z.string(),
  card_url: z.string(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type BusinessCard = z.infer<typeof businessCardSchema>;

export const generateCardResponseSchema = z.object({
  user_id: z.number(),
  uid: z.string(),
  card_url: z.string(),
});

export type GenerateCardResponse = z.infer<typeof generateCardResponseSchema>;
