import { z } from 'zod';

export const PROFILE_PLATFORMS = [
  'behance',
  'bigo_live',
  'discord',
  'facebook',
  'messenger',
  'github',
  'instagram',
  'linkedin',
  'pinterest',
  'skype',
  'snapchat',
  'spotify',
  'stackoverflow',
  'teams',
  'telegram',
  'tiktok',
  'twitter',
  'viber',
  'vimeo',
  'wechat',
  'website',
  'whatsapp',
  'youtube',
  'phone',
  'email',
  'other',
] as const;

export type ProfilePlatform = (typeof PROFILE_PLATFORMS)[number];

export const profileSocialSchema = z.object({
  id: z.number(),
  customer_id: z.number(),
  platform: z.enum(PROFILE_PLATFORMS),
  platform_value: z.string(),
  url: z.string().nullable().optional(),
  label: z.string().nullable().optional(),
  is_primary: z.boolean().optional(),
  sort_order: z.number().optional(),
});

export type ProfileSocial = z.infer<typeof profileSocialSchema>;

export const profileSocialFormSchema = z.object({
  platform: z.enum(PROFILE_PLATFORMS),
  platform_value: z.string().min(1, 'Value is required').max(255),
  url: z.string().max(500).optional().or(z.literal('')),
  label: z.string().max(255).optional().or(z.literal('')),
  is_primary: z.boolean().optional(),
  sort_order: z.coerce.number().int().min(0).optional(),
});

export type ProfileSocialFormValues = z.infer<typeof profileSocialFormSchema>;

export const PLATFORM_LABELS: Record<ProfilePlatform, string> = {
  behance: 'Behance',
  bigo_live: 'Bigo Live',
  discord: 'Discord',
  facebook: 'Facebook',
  messenger: 'Messenger',
  github: 'GitHub',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
  pinterest: 'Pinterest',
  skype: 'Skype',
  snapchat: 'Snapchat',
  spotify: 'Spotify',
  stackoverflow: 'Stack Overflow',
  teams: 'Microsoft Teams',
  telegram: 'Telegram',
  tiktok: 'TikTok',
  twitter: 'Twitter / X',
  viber: 'Viber',
  vimeo: 'Vimeo',
  wechat: 'WeChat',
  website: 'Website',
  whatsapp: 'WhatsApp',
  youtube: 'YouTube',
  phone: 'Phone',
  email: 'Email',
  other: 'Other',
};
