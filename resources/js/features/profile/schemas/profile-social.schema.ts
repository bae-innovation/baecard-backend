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

export const profileSocialLinkSchema = z.object({
  platform: z.enum(PROFILE_PLATFORMS),
  url: z.string(),
});

export type ProfileSocialLink = z.infer<typeof profileSocialLinkSchema>;

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
