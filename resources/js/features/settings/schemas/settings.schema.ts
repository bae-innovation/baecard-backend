import { z } from 'zod';

export const generalSettingsSchema = z.object({
  site_name: z.string().min(1, 'Site name is required').max(255),
  tagline: z.string().max(255).optional().or(z.literal('')),
  site_url: z.string().url('Enter a valid site URL').max(255),
  contact_email: z.string().email('Enter a valid contact email').max(255),
  support_phone: z.string().max(50).optional().or(z.literal('')),
  street: z.string().max(255).optional().or(z.literal('')),
  city: z.string().max(100).optional().or(z.literal('')),
  state: z.string().max(100).optional().or(z.literal('')),
  country: z.string().max(100).optional().or(z.literal('')),
  postal_code: z.string().max(20).optional().or(z.literal('')),
  privacy_policy_url: z
    .string()
    .url('Enter a valid privacy policy URL')
    .max(255)
    .optional()
    .or(z.literal('')),
  terms_url: z
    .string()
    .url('Enter a valid terms URL')
    .max(255)
    .optional()
    .or(z.literal('')),
  copyright_text: z.string().max(255).optional().or(z.literal('')),
});

export const brandingSettingsSchema = z.object({
  primary_color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Enter a valid hex color')
    .optional()
    .or(z.literal('')),
});

export const businessSettingsSchema = z.object({
  currency: z.string().min(1, 'Currency is required').max(10),
  currency_symbol: z.string().min(1, 'Currency symbol is required').max(10),
  tax_rate: z.coerce.number().min(0, 'Tax rate must be at least 0').max(100, 'Tax rate cannot exceed 100'),
  order_prefix: z.string().min(1, 'Order prefix is required').max(20),
});

export const socialSettingsSchema = z.object({
  whatsapp: z.string().max(255).optional().or(z.literal('')),
  facebook: z.string().url('Enter a valid Facebook URL').max(255).optional().or(z.literal('')),
  instagram: z.string().url('Enter a valid Instagram URL').max(255).optional().or(z.literal('')),
  twitter: z.string().url('Enter a valid Twitter URL').max(255).optional().or(z.literal('')),
  linkedin: z.string().url('Enter a valid LinkedIn URL').max(255).optional().or(z.literal('')),
  youtube: z.string().url('Enter a valid YouTube URL').max(255).optional().or(z.literal('')),
  tiktok: z.string().url('Enter a valid TikTok URL').max(255).optional().or(z.literal('')),
});

export const emailSettingsSchema = z.object({
  from_name: z.string().min(1, 'From name is required').max(255),
  from_email: z.string().email('Enter a valid from email').max(255),
  support_email: z.string().email('Enter a valid support email').max(255),
});

export type GeneralSettings = z.infer<typeof generalSettingsSchema>;
export type BrandingSettings = z.infer<typeof brandingSettingsSchema> & {
  logo_white?: string | null;
  logo_black?: string | null;
  admin_logo?: string | null;
  logo_white_url?: string | null;
  logo_black_url?: string | null;
  admin_logo_url?: string | null;
};
export type BusinessSettings = z.infer<typeof businessSettingsSchema>;
export type SocialSettings = z.infer<typeof socialSettingsSchema>;
export type EmailSettings = z.infer<typeof emailSettingsSchema>;

export type AppSettings = {
  general: GeneralSettings;
  branding: BrandingSettings;
  business: BusinessSettings;
  social: SocialSettings;
  email: EmailSettings;
};

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;
export type BrandingSettingsFormValues = z.infer<typeof brandingSettingsSchema>;
export type BusinessSettingsFormValues = z.infer<typeof businessSettingsSchema>;
export type SocialSettingsFormValues = z.infer<typeof socialSettingsSchema>;
export type EmailSettingsFormValues = z.infer<typeof emailSettingsSchema>;
