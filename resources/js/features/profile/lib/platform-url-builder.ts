import type { ProfilePlatform } from '@/features/profile/schemas/profile-social.schema';

const URL_PATTERNS: Partial<Record<ProfilePlatform, string>> = {
  instagram: 'https://instagram.com/{v}',
  twitter: 'https://twitter.com/{v}',
  facebook: 'https://facebook.com/{v}',
  linkedin: 'https://linkedin.com/in/{v}',
  tiktok: 'https://tiktok.com/@{v}',
  github: 'https://github.com/{v}',
  whatsapp: 'https://wa.me/{v}',
  telegram: 'https://t.me/{v}',
  youtube: 'https://youtube.com/@{v}',
  snapchat: 'https://snapchat.com/add/{v}',
  behance: 'https://behance.net/{v}',
  pinterest: 'https://pinterest.com/{v}',
  spotify: 'https://open.spotify.com/user/{v}',
  vimeo: 'https://vimeo.com/{v}',
  discord: 'https://discord.com/users/{v}',
  messenger: 'https://m.me/{v}',
  website: '{v}',
  phone: 'tel:{v}',
  email: 'mailto:{v}',
};

export function buildPlatformUrl(
  platform: ProfilePlatform,
  platformValue: string,
  customUrl?: string | null,
): string {
  const trimmedCustom = customUrl?.trim();
  if (trimmedCustom) {
    return trimmedCustom;
  }

  const pattern = URL_PATTERNS[platform];
  if (!pattern) {
    return platformValue;
  }

  return pattern.replace('{v}', encodeURIComponent(platformValue));
}

export function isContactPlatform(platform: ProfilePlatform): boolean {
  return platform === 'phone' || platform === 'email';
}

export function isSocialPlatform(platform: ProfilePlatform): boolean {
  return !isContactPlatform(platform);
}
