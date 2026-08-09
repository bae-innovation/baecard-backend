import { Globe, Link2, Mail, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { ProfilePlatform } from '@/features/profile/schemas/profile-social.schema';
import { cn } from '@/lib/utils';

const PLATFORM_ICON_SRC: Partial<Record<ProfilePlatform, string>> = {
  behance: '/frontend/socials/behance.svg',
  bigo_live: '/frontend/socials/bigolive.svg',
  discord: '/frontend/socials/discord.svg',
  facebook: '/frontend/socials/facebook.svg',
  messenger: '/frontend/socials/fbmessenger.svg',
  github: '/frontend/socials/github.svg',
  instagram: '/frontend/socials/instagram.svg',
  linkedin: '/frontend/socials/linkedin.svg',
  pinterest: '/frontend/socials/pinterest.svg',
  skype: '/frontend/socials/skype.svg',
  snapchat: '/frontend/socials/snapchat.svg',
  spotify: '/frontend/socials/spotify.svg',
  stackoverflow: '/frontend/socials/stackoverflow.svg',
  teams: '/frontend/socials/teams.svg',
  telegram: '/frontend/socials/telegram.svg',
  tiktok: '/frontend/socials/tiktok.svg',
  twitter: '/frontend/socials/twitter.svg',
  viber: '/frontend/socials/viber.svg',
  vimeo: '/frontend/socials/vimeo.svg',
  wechat: '/frontend/socials/wechat.svg',
  website: '/frontend/socials/website.svg',
  whatsapp: '/frontend/socials/whatsapp.svg',
  youtube: '/frontend/socials/youtube.svg',
};

const FALLBACK_ICONS: Record<
  'phone' | 'email' | 'other',
  { icon: LucideIcon; className: string; iconClassName: string }
> = {
  phone: {
    icon: Phone,
    className: 'bg-emerald-500',
    iconClassName: 'text-white',
  },
  email: {
    icon: Mail,
    className: 'bg-sky-500',
    iconClassName: 'text-white',
  },
  other: {
    icon: Link2,
    className: 'bg-muted',
    iconClassName: 'text-muted-foreground',
  },
};

const SIZE_CLASSES = {
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-12',
} as const;

const ICON_SIZE_CLASSES = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
} as const;

type PlatformIconProps = {
  platform: ProfilePlatform;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
};

export function PlatformIcon({ platform, size = 'md', className }: PlatformIconProps) {
  const sizeClass = SIZE_CLASSES[size];
  const iconSrc = PLATFORM_ICON_SRC[platform];

  if (iconSrc) {
    return (
      <img
        src={iconSrc}
        alt=""
        className={cn('shrink-0 rounded-lg object-cover', sizeClass, className)}
      />
    );
  }

  const fallback = FALLBACK_ICONS[platform as keyof typeof FALLBACK_ICONS] ?? {
    icon: Globe,
    className: 'bg-muted',
    iconClassName: 'text-muted-foreground',
  };
  const FallbackIcon = fallback.icon;

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-lg',
        sizeClass,
        fallback.className,
        className,
      )}
    >
      <FallbackIcon className={cn(ICON_SIZE_CLASSES[size], fallback.iconClassName)} />
    </span>
  );
}
