import { useEffect, useState } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Home,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';

import { PlatformIcon } from '@/features/profile/components/platform-icon';
import { isSocialPlatform } from '@/features/profile/lib/platform-url-builder';
import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import { PLATFORM_LABELS } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';
import {
  type ProfileThemeTokens,
} from '@/features/profile/templates/theme-tokens';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { showMutationSuccess } from '@/lib/mutation-toast';

export type ProfileManagementControls = {
  isActive: boolean;
  activating?: boolean;
  onActivateChange: (active: boolean) => void;
};

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    showMutationSuccess('Copied');
  } catch {
    // Ignore clipboard failures in unsupported browsers.
  }
}

function escapeVCard(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function downloadVCard(user: ProfileTemplateProps['user']) {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(user.name)}`,
  ];

  if (user.first_name || user.last_name) {
    lines.push(
      `N:${escapeVCard(user.last_name || '')};${escapeVCard(user.first_name || '')};;;`,
    );
  }

  if (user.company) {
    lines.push(`ORG:${escapeVCard(user.company)}`);
  }

  if (user.designation) {
    lines.push(`TITLE:${escapeVCard(user.designation)}`);
  }

  if (user.personal_phone) {
    lines.push(`TEL;TYPE=CELL:${escapeVCard(user.personal_phone)}`);
  }

  if (user.work_phone) {
    lines.push(`TEL;TYPE=WORK:${escapeVCard(user.work_phone)}`);
  }

  const personalEmail = user.personal_email || user.email;
  if (personalEmail) {
    lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(personalEmail)}`);
  }

  if (user.work_email) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVCard(user.work_email)}`);
  }

  const address = user.personal_address || user.work_address;
  if (address) {
    lines.push(`ADR;TYPE=HOME:;;${escapeVCard(address)};;;;`);
  }

  if (user.bio) {
    lines.push(`NOTE:${escapeVCard(user.bio)}`);
  }

  lines.push('END:VCARD');

  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${user.name.replace(/\s+/g, '-') || 'contact'}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function ProfileCover({
  coverUrl,
  show = true,
  theme,
  management,
  className,
}: {
  coverUrl?: string | null;
  show?: boolean;
  theme: ProfileThemeTokens;
  management?: ProfileManagementControls;
  className?: string;
}) {
  if (!show && !management) {
    return <div className="h-6" />;
  }

  const hasImage = show && !!coverUrl;

  return (
    <div className={cn('relative h-40 w-full overflow-hidden sm:h-44', className)}>
      {hasImage ? (
        <img src={coverUrl!} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className={cn('h-full w-full', theme.coverFallback)} />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />

      {management ? (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-md">
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/90">
            {management.isActive ? 'Active' : 'Inactive'}
          </span>
          <Switch
            checked={management.isActive}
            disabled={management.activating || management.isActive}
            onCheckedChange={(checked) => {
              if (checked) {
                management.onActivateChange(true);
              }
            }}
            className={cn('h-5 w-9 border-0 shadow-none', theme.accentSwitch)}
            aria-label="Set as active theme"
          />
        </div>
      ) : null}
    </div>
  );
}

export function ProfileAvatar({
  name,
  avatarUrl,
  className,
  borderClassName = 'border-background',
  shape = 'circle',
}: {
  name: string;
  avatarUrl?: string | null;
  className?: string;
  borderClassName?: string;
  shape?: 'circle' | 'rounded';
}) {
  const shapeClass =
    shape === 'rounded'
      ? 'h-28 w-24 rounded-2xl border-[3px] object-cover sm:h-32 sm:w-28'
      : 'size-[6.5rem] rounded-full border-[3px] object-cover sm:size-28';

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(shapeClass, borderClassName, className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-center border-[3px] bg-sky-600 text-3xl font-bold text-white',
        shape === 'rounded'
          ? 'h-28 w-24 rounded-2xl sm:h-32 sm:w-28'
          : 'size-[6.5rem] rounded-full sm:size-28',
        borderClassName,
        className,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

const MOBILE_VISIBLE_ICONS = 5;
const DESKTOP_VISIBLE_ICONS = 6;

function useVisibleSocialCount() {
  const [count, setCount] = useState(MOBILE_VISIBLE_ICONS);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 640px)');
    const sync = () => {
      setCount(media.matches ? DESKTOP_VISIBLE_ICONS : MOBILE_VISIBLE_ICONS);
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return count;
}

function ProfileSocialLinkItem({ link }: { link: ProfileSocialLink }) {
  const label = PLATFORM_LABELS[link.platform] ?? link.platform;

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noreferrer"
      title={link.url}
      aria-label={label}
      className="inline-flex size-11 shrink-0 items-center justify-center bg-transparent sm:size-12"
    >
      <PlatformIcon
        platform={link.platform}
        size="lg"
        className="block size-11 rounded-none bg-transparent object-contain drop-shadow-md sm:size-12"
      />
    </a>
  );
}

function SocialArrowButton({
  direction,
  disabled,
  theme,
  onClick,
}: {
  direction: 'prev' | 'next';
  disabled: boolean;
  theme: ProfileThemeTokens;
  onClick: () => void;
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'prev' ? 'Previous social links' : 'Next social links'}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center bg-transparent p-0 shadow-none',
        'transition hover:scale-110 disabled:pointer-events-none disabled:opacity-20',
        theme.mode === 'dark' ? 'text-sky-400 hover:text-sky-300' : 'text-sky-500 hover:text-sky-600',
      )}
    >
      <Icon className="size-6" strokeWidth={2.5} />
    </button>
  );
}

export function ProfileSocialSlider({
  links,
  show = true,
  theme,
}: {
  links: ProfileSocialLink[];
  show?: boolean;
  theme: ProfileThemeTokens;
}) {
  const visibleCount = useVisibleSocialCount();
  const [startIndex, setStartIndex] = useState(0);

  const socialLinks = links.filter(
    (link) => isSocialPlatform(link.platform) && link.url.trim() !== '',
  );

  const maxStart = Math.max(0, socialLinks.length - visibleCount);

  useEffect(() => {
    setStartIndex((current) => Math.min(current, maxStart));
  }, [maxStart]);

  if (!show || socialLinks.length === 0) {
    return null;
  }

  const canShift = socialLinks.length > visibleCount;
  const visibleLinks = canShift
    ? socialLinks.slice(startIndex, startIndex + visibleCount)
    : socialLinks;

  return (
    <div className={cn('-mx-4 sm:-mx-5', theme.socialBar)}>
      <div className="flex items-center justify-center gap-1 px-2 py-3 sm:px-3 sm:py-3.5">
        {canShift ? (
          <SocialArrowButton
            direction="prev"
            disabled={startIndex <= 0}
            theme={theme}
            onClick={() => setStartIndex((current) => Math.max(0, current - 1))}
          />
        ) : null}

        <div className="flex min-w-0 flex-1 items-center justify-center gap-4 sm:gap-5">
          {visibleLinks.map((link, index) => (
            <ProfileSocialLinkItem key={`${link.platform}-${startIndex + index}`} link={link} />
          ))}
        </div>

        {canShift ? (
          <SocialArrowButton
            direction="next"
            disabled={startIndex >= maxStart}
            theme={theme}
            onClick={() => setStartIndex((current) => Math.min(maxStart, current + 1))}
          />
        ) : null}
      </div>
    </div>
  );
}

type ContactEntry = {
  value: string;
  kind: 'phone' | 'email' | 'address';
  variant: 'personal' | 'work';
};

function ContactRow({
  entry,
  theme,
  isLast,
}: {
  entry: ContactEntry;
  theme: ProfileThemeTokens;
  isLast: boolean;
}) {
  const Icon =
    entry.kind === 'phone'
      ? entry.variant === 'work'
        ? Building2
        : Home
      : entry.kind === 'email'
        ? entry.variant === 'work'
          ? Building2
          : Mail
        : MapPin;

  const actionHref =
    entry.kind === 'phone'
      ? `tel:${entry.value}`
      : entry.kind === 'email'
        ? `mailto:${entry.value}`
        : `https://maps.google.com/?q=${encodeURIComponent(entry.value)}`;

  const ActionIcon = entry.kind === 'phone' ? Phone : entry.kind === 'email' ? Send : MapPin;
  const actionLabel =
    entry.kind === 'phone' ? 'Call' : entry.kind === 'email' ? 'Send email' : 'Open map';

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3.5 py-3.5 sm:px-4',
        !isLast && `border-b ${theme.contactDivider}`,
      )}
    >
      <span
        className={cn(
          'inline-flex size-8 shrink-0 items-center justify-center rounded-full',
          theme.mode === 'dark' ? 'bg-white/10' : 'bg-black/5',
          theme.contactMuted,
        )}
      >
        <Icon className="size-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className={cn('text-[11px] font-medium uppercase tracking-wide', theme.contactMuted)}>
          {entry.variant === 'work' ? 'Work' : 'Personal'}{' '}
          {entry.kind === 'phone' ? 'phone' : entry.kind === 'email' ? 'email' : 'address'}
        </p>
        <p className={cn('truncate text-[13px] font-medium sm:text-sm', theme.contactText)}>
          {entry.value}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <button
          type="button"
          onClick={() => void copyText(entry.value)}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full transition',
            theme.contactIcon,
          )}
          aria-label={`Copy ${entry.kind}`}
        >
          <Copy className="size-3.5" />
        </button>
        <a
          href={actionHref}
          target={entry.kind === 'address' ? '_blank' : undefined}
          rel={entry.kind === 'address' ? 'noreferrer' : undefined}
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-full transition',
            theme.contactIcon,
          )}
          aria-label={actionLabel}
        >
          <ActionIcon className="size-3.5" />
        </a>
      </div>
    </div>
  );
}

export function ProfileProfessionalCard({
  user,
  theme,
}: {
  user: ProfileTemplateProps['user'];
  theme: ProfileThemeTokens;
}) {
  const company = user.company?.trim() || '';
  const designation = user.designation?.trim() || '';
  const workAddress = user.work_address?.trim() || '';

  if (!company && !designation && !workAddress) {
    return null;
  }

  const rows = [
    ...(designation ? [{ label: 'Designation', value: designation }] : []),
    ...(company ? [{ label: 'Company', value: company }] : []),
    ...(workAddress ? [{ label: 'Work address', value: workAddress }] : []),
  ];

  return (
    <div className={cn('overflow-hidden rounded-2xl', theme.contactCard)}>
      {rows.map((row, index) => (
        <div
          key={row.label}
          className={cn(
            'flex items-center gap-3 px-3.5 py-3.5 sm:px-4',
            index < rows.length - 1 && `border-b ${theme.contactDivider}`,
          )}
        >
          <span
            className={cn(
              'inline-flex size-8 shrink-0 items-center justify-center rounded-full',
              theme.mode === 'dark' ? 'bg-white/10' : 'bg-black/5',
              theme.contactMuted,
            )}
          >
            {row.label === 'Work address' ? (
              <MapPin className="size-3.5" />
            ) : (
              <Building2 className="size-3.5" />
            )}
          </span>
          <div className="min-w-0 flex-1">
            <p className={cn('text-[11px] font-medium uppercase tracking-wide', theme.contactMuted)}>
              {row.label}
            </p>
            <p className={cn('truncate text-[13px] font-medium sm:text-sm', theme.contactText)}>
              {row.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileContactCards({
  user,
  showPhones = true,
  showEmails = true,
  showAddresses = true,
  theme,
}: {
  user: ProfileTemplateProps['user'];
  showPhones?: boolean;
  showEmails?: boolean;
  showAddresses?: boolean;
  theme: ProfileThemeTokens;
}) {
  const phones: ContactEntry[] = showPhones
    ? [
        ...(user.personal_phone
          ? [{ value: user.personal_phone, kind: 'phone' as const, variant: 'personal' as const }]
          : []),
        ...(user.work_phone
          ? [{ value: user.work_phone, kind: 'phone' as const, variant: 'work' as const }]
          : []),
      ]
    : [];

  const emails: ContactEntry[] = showEmails
    ? [
        ...(user.personal_email || user.email
          ? [
              {
                value: (user.personal_email || user.email) as string,
                kind: 'email' as const,
                variant: 'personal' as const,
              },
            ]
          : []),
        ...(user.work_email
          ? [{ value: user.work_email, kind: 'email' as const, variant: 'work' as const }]
          : []),
      ]
    : [];

  const addresses: ContactEntry[] = showAddresses
    ? [
        ...(user.personal_address
          ? [
              {
                value: user.personal_address,
                kind: 'address' as const,
                variant: 'personal' as const,
              },
            ]
          : []),
      ]
    : [];

  if (phones.length === 0 && emails.length === 0 && addresses.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {phones.length > 0 ? (
        <div className={cn('overflow-hidden rounded-2xl', theme.contactCard)}>
          {phones.map((phone, index) => (
            <ContactRow
              key={`${phone.variant}-${phone.value}`}
              entry={phone}
              theme={theme}
              isLast={index === phones.length - 1}
            />
          ))}
        </div>
      ) : null}

      {emails.length > 0 ? (
        <div className={cn('overflow-hidden rounded-2xl', theme.contactCard)}>
          {emails.map((email, index) => (
            <ContactRow
              key={`${email.variant}-${email.value}`}
              entry={email}
              theme={theme}
              isLast={index === emails.length - 1}
            />
          ))}
        </div>
      ) : null}

      {addresses.length > 0 ? (
        <div className={cn('overflow-hidden rounded-2xl', theme.contactCard)}>
          {addresses.map((address, index) => (
            <ContactRow
              key={`${address.variant}-${address.value}`}
              entry={address}
              theme={theme}
              isLast={index === addresses.length - 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ProfilePublicActions({
  user,
  theme,
}: {
  user: ProfileTemplateProps['user'];
  theme: ProfileThemeTokens;
}) {
  const connectEmail = user.personal_email || user.work_email || user.email;
  const connectHref = connectEmail
    ? `mailto:${connectEmail}`
    : user.personal_phone || user.work_phone
      ? `tel:${user.personal_phone || user.work_phone}`
      : undefined;

  return (
    <div className="flex flex-col gap-3 pt-2">
      <button
        type="button"
        onClick={() => downloadVCard(user)}
        className={cn(
          'inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition',
          theme.actionOutline,
        )}
      >
        Save
      </button>
      {connectHref ? (
        <a
          href={connectHref}
          className={cn(
            'inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition',
            theme.actionSolid,
          )}
        >
          Connect
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={cn(
            'inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold opacity-50',
            theme.actionSolid,
          )}
        >
          Connect
        </button>
      )}
    </div>
  );
}

export function useProfileSections(props: ProfileTemplateProps) {
  return {
    showCover: true,
    showBio: !!props.user.bio,
    showPhones: true,
    showEmails: true,
    showAddresses: true,
    showSocial: props.social_links.some((link) => link.url.trim() !== ''),
  };
}
