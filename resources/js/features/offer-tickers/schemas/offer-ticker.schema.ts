import { z } from 'zod';

export const OFFER_TICKER_THEMES = ['coral', 'emerald', 'violet', 'amber', 'sky'] as const;

export type OfferTickerTheme = (typeof OFFER_TICKER_THEMES)[number];

export const OFFER_TICKER_THEME_LABELS: Record<OfferTickerTheme, string> = {
  coral: 'Coral Red',
  emerald: 'Emerald Teal',
  violet: 'Violet Purple',
  amber: 'Amber Gold',
  sky: 'Sky Blue',
};

export const OFFER_TICKER_THEME_GRADIENTS: Record<OfferTickerTheme, string> = {
  coral: 'linear-gradient(90deg, #e53e3e 0%, #dc2626 50%, #f97316 100%)',
  emerald: 'linear-gradient(90deg, #059669 0%, #10b981 50%, #14b8a6 100%)',
  violet: 'linear-gradient(90deg, #7c3aed 0%, #8b5cf6 50%, #a855f7 100%)',
  amber: 'linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #eab308 100%)',
  sky: 'linear-gradient(90deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
};

const localizedStringSchema = z.object({
  en: z.string(),
  bn: z.string(),
});

export const offerTickerSchema = z.object({
  id: z.number(),
  message: localizedStringSchema,
  badge: localizedStringSchema.nullable().optional(),
  href: z.string().nullable().optional(),
  theme: z.enum(OFFER_TICKER_THEMES),
  is_active: z.boolean(),
  sort_order: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type OfferTicker = z.infer<typeof offerTickerSchema>;

export const offerTickerFormSchema = z.object({
  message_en: z.string().min(1, 'English message is required').max(500),
  message_bn: z.string().min(1, 'Bengali message is required').max(500),
  badge_en: z.string().max(100).optional().or(z.literal('')),
  badge_bn: z.string().max(100).optional().or(z.literal('')),
  href: z.string().max(500).optional().or(z.literal('')),
  theme: z.enum(OFFER_TICKER_THEMES),
  is_active: z.boolean(),
  sort_order: z.coerce.number().int().min(0),
});

export type OfferTickerFormValues = z.infer<typeof offerTickerFormSchema>;

export function serializeOfferTickerFormPayload(values: OfferTickerFormValues) {
  return {
    message: {
      en: values.message_en,
      bn: values.message_bn,
    },
    badge:
      values.badge_en || values.badge_bn
        ? {
            en: values.badge_en ?? '',
            bn: values.badge_bn ?? '',
          }
        : null,
    href: values.href || null,
    theme: values.theme,
    is_active: values.is_active,
    sort_order: values.sort_order,
  };
}

export function offerTickerToFormValues(ticker: OfferTicker): OfferTickerFormValues {
  return {
    message_en: ticker.message.en,
    message_bn: ticker.message.bn,
    badge_en: ticker.badge?.en ?? '',
    badge_bn: ticker.badge?.bn ?? '',
    href: ticker.href ?? '',
    theme: ticker.theme,
    is_active: ticker.is_active,
    sort_order: ticker.sort_order,
  };
}
