import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import * as React from 'react';

import { frontendAsset } from '@frontend/lib/brand';
import { useAppSettings } from '@/hooks/useAppSettings';
import type { FloatingSocialLink } from '@/types/app-settings';
import { cn } from '@/lib/utils';

const PLATFORM_ICONS: Record<string, string> = {
  whatsapp: frontendAsset('socials/whatsapp.svg'),
  facebook: frontendAsset('socials/facebook.svg'),
  instagram: frontendAsset('socials/instagram.svg'),
  linkedin: frontendAsset('socials/linkedin.svg'),
  telegram: frontendAsset('socials/telegram.svg'),
  youtube: frontendAsset('socials/youtube.svg'),
  tiktok: frontendAsset('socials/tiktok.svg'),
  twitter: frontendAsset('socials/twitter.svg'),
};

function buildFallbackLinks(app: ReturnType<typeof useAppSettings>): FloatingSocialLink[] {
  const links: FloatingSocialLink[] = [];

  if (app.support_phone) {
    links.push({
      id: 'fallback-phone',
      platform: 'phone',
      platform_value: app.support_phone,
      href: `tel:${app.support_phone.replace(/\s/g, '')}`,
      show_in_floating: true,
    });
  }

  if (app.whatsapp) {
    links.push({
      id: 'fallback-whatsapp',
      platform: 'whatsapp',
      platform_value: app.whatsapp,
      href: `https://wa.me/${app.whatsapp.replace(/\D/g, '')}`,
      show_in_floating: true,
    });
  }

  if (app.facebook) {
    links.push({
      id: 'fallback-facebook',
      platform: 'facebook',
      platform_value: app.facebook,
      href: app.facebook,
      show_in_floating: true,
    });
  }

  return links;
}

function FloatingIconButton({
  children,
  className,
  ...props
}: React.ComponentProps<typeof motion.button>) {
  return (
    <motion.button
      type="button"
      className={cn(
        'fe-touch flex size-12 items-center justify-center rounded-full bg-fe-accent text-fe-bg shadow-lg shadow-fe-accent/25 ring-2 ring-white/10 md:size-14',
        className,
      )}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

type FloatingIconLinkProps = {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
};

function FloatingIconLink({ href, label, children, className }: FloatingIconLinkProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={cn(
        'fe-touch flex size-12 items-center justify-center rounded-full bg-fe-accent text-fe-bg shadow-lg shadow-fe-accent/25 ring-2 ring-white/10 md:size-14',
        className,
      )}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

function renderSocialIcon(platform: string) {
  if (platform === 'phone') {
    return <Phone className="size-5 md:size-6" />;
  }

  const iconSrc = PLATFORM_ICONS[platform];
  if (iconSrc) {
    return <img src={iconSrc} alt="" className="size-6 md:size-7" />;
  }

  return <span className="text-sm font-bold uppercase">{platform.slice(0, 2)}</span>;
}

function FloatingSocialItem({ link }: { link: FloatingSocialLink }) {
  const label = link.label ?? link.platform;

  if (link.platform === 'phone') {
    return (
      <FloatingIconLink href={link.href} label={label}>
        <Phone className="size-5 md:size-6" />
      </FloatingIconLink>
    );
  }

  return (
    <FloatingIconLink href={link.href} label={label}>
      {renderSocialIcon(link.platform)}
    </FloatingIconLink>
  );
}

export function FloatingActions() {
  const app = useAppSettings();
  const links = React.useMemo(() => {
    const managed = app.floating_socials ?? [];
    if (managed.length > 0) {
      return managed;
    }

    return buildFallbackLinks(app);
  }, [app]);

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-3 z-30 hidden md:block">
      <div className="pointer-events-auto flex flex-col gap-3">
        {links.map((link) => (
          <FloatingSocialItem key={link.id} link={link} />
        ))}
      </div>
    </div>
  );
}