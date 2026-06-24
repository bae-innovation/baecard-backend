import QRCode from 'react-qr-code';

import {
  buildPlatformUrl,
  isContactPlatform,
  isSocialPlatform,
} from '@/features/profile/lib/platform-url-builder';
import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';
import {
  formatPrice,
  resolveVisibility,
  type ProfileTemplateProps,
} from '@/features/profile/templates/profile-template-types';
import { PLATFORM_LABELS } from '@/features/profile/schemas/profile-social.schema';
import { cn } from '@/lib/utils';

function SocialIcon({ platform }: { platform: ProfileSocial['platform'] }) {
  const label = PLATFORM_LABELS[platform]?.charAt(0) ?? '?';

  return (
    <span className="text-xs font-semibold uppercase">{label.slice(0, 2)}</span>
  );
}

export function ProfileCover({
  coverUrl,
  show,
  className,
}: {
  coverUrl?: string | null;
  show: boolean;
  className?: string;
}) {
  if (!show || !coverUrl) {
    return null;
  }

  return (
    <div className={cn('relative h-40 w-full overflow-hidden sm:h-48', className)}>
      <img src={coverUrl} alt="" className="h-full w-full object-cover" />
    </div>
  );
}

export function ProfileAvatar({
  name,
  avatarUrl,
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn('size-24 rounded-full border-4 border-background object-cover', className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex size-24 items-center justify-center rounded-full border-4 border-background bg-primary text-3xl font-bold text-primary-foreground',
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function ProfileSocialGrid({
  links,
  show,
  variant = 'light',
}: {
  links: ProfileSocial[];
  show: boolean;
  variant?: 'light' | 'dark';
}) {
  if (!show) {
    return null;
  }

  const socialLinks = links.filter((link) => isSocialPlatform(link.platform));

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {socialLinks.map((link) => {
        const href = buildPlatformUrl(link.platform, link.platform_value, link.url);

        return (
          <a
            key={link.id}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'flex aspect-square items-center justify-center rounded-xl border transition hover:opacity-80',
              variant === 'dark'
                ? 'border-white/10 bg-white/5 text-white'
                : 'border-border bg-background text-foreground',
            )}
            title={link.label ?? PLATFORM_LABELS[link.platform]}
          >
            <SocialIcon platform={link.platform} />
          </a>
        );
      })}
    </div>
  );
}

export function ProfileContactList({
  user,
  links,
  showPhones,
  showEmails,
  variant = 'light',
}: {
  user: ProfileTemplateProps['user'];
  links: ProfileSocial[];
  showPhones: boolean;
  showEmails: boolean;
  variant?: 'light' | 'dark';
}) {
  const phoneLinks = links.filter((link) => link.platform === 'phone');
  const emailLinks = links.filter((link) => link.platform === 'email');
  const phones = showPhones
    ? [
        ...(user.phone ? [{ value: user.phone, label: 'Primary' }] : []),
        ...phoneLinks.map((link) => ({
          value: link.platform_value,
          label: link.label ?? PLATFORM_LABELS.phone,
        })),
      ]
    : [];
  const emails = showEmails
    ? [
        ...(user.email ? [{ value: user.email, label: 'Primary' }] : []),
        ...emailLinks.map((link) => ({
          value: link.platform_value,
          label: link.label ?? PLATFORM_LABELS.email,
        })),
      ]
    : [];

  if (phones.length === 0 && emails.length === 0) {
    return null;
  }

  const itemClass =
    variant === 'dark'
      ? 'rounded-xl border border-white/10 bg-white/5 p-3 text-white'
      : 'rounded-xl border bg-muted/40 p-3';

  return (
    <div className="space-y-4">
      {phones.length > 0 ? (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Contact</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {phones.map((phone) => (
              <div key={`${phone.label}-${phone.value}`} className={itemClass}>
                <p className="text-xs opacity-70">{phone.label}</p>
                <a href={`tel:${phone.value}`} className="text-sm font-medium hover:underline">
                  {phone.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {emails.length > 0 ? (
        <div className="space-y-2">
          <div className="grid gap-2 sm:grid-cols-2">
            {emails.map((email) => (
              <div key={`${email.label}-${email.value}`} className={itemClass}>
                <p className="text-xs opacity-70">{email.label}</p>
                <a href={`mailto:${email.value}`} className="text-sm font-medium hover:underline">
                  {email.value}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ProfileServicesSection({
  services,
  show,
  variant = 'light',
}: {
  services: ProfileService[];
  show: boolean;
  variant?: 'light' | 'dark';
}) {
  if (!show || services.length === 0) {
    return null;
  }

  const cardClass =
    variant === 'dark'
      ? 'rounded-2xl border border-white/10 bg-white/5 p-4 text-white'
      : 'rounded-2xl border bg-background p-4';

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Services</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => (
          <div key={service.id} className={cardClass}>
            {service.image_url ? (
              <img
                src={service.image_url}
                alt={service.name}
                className="mb-3 h-24 w-full rounded-lg object-cover"
              />
            ) : null}
            <p className="font-medium">{service.name}</p>
            {service.description ? (
              <p className="mt-1 text-sm opacity-70">{service.description}</p>
            ) : null}
            {service.price != null ? (
              <p className="mt-2 text-sm font-semibold">{formatPrice(service.price)}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ProfileQrSection({
  scanUrl,
  show,
  variant = 'light',
}: {
  scanUrl: string;
  show: boolean;
  variant?: 'light' | 'dark';
}) {
  if (!show) {
    return null;
  }

  return (
    <div className="space-y-3 text-center">
      <h3 className="text-sm font-semibold">QR Code and Link</h3>
      <div className="mx-auto inline-flex rounded-2xl bg-white p-4">
        <QRCode value={scanUrl} size={160} />
      </div>
      <p className={cn('break-all text-xs', variant === 'dark' ? 'text-white/70' : 'text-muted-foreground')}>
        {scanUrl}
      </p>
    </div>
  );
}

export function useProfileSections(props: ProfileTemplateProps) {
  const visibility = resolveVisibility(props.user.profile_visibility);

  return {
    visibility,
    showCover: visibility.cover && !!props.user.cover_image_url,
    showBio: visibility.bio && !!props.user.bio,
    showPhones: visibility.phones,
    showEmails: visibility.emails,
    showSocial: visibility.social,
    showServices: visibility.services,
    showQr: visibility.qr,
  };
}
