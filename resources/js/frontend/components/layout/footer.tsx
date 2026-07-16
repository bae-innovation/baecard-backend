import { Link } from '@inertiajs/react';

import { frontendAsset } from '@frontend/lib/brand';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { useAppSettings } from '@/hooks/useAppSettings';

import { Facebook, Instagram, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';

export function Footer() {
  const app = useAppSettings();
  const { content, translate } = useMarketingContent();

  const whatsappNumber = app.whatsapp ?? app.support_phone;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
    : null;

  const navigationLinks = content.navigation.slice(1);

  return (
    <footer className="border-t border-fe-border bg-fe-surface py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 md:px-6">
        {/* Mobile: single column; Tablet: 2 cols; Desktop: 4 cols */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={frontendAsset('BAE CARD White.svg')}
              alt="BAE Card"
              className="mb-4 h-9 invert dark:invert-0 sm:h-10"
            />
            <p className="text-sm leading-relaxed text-fe-muted">
              {translate({
                en: 'Our revolutionary BAE CARD is a Smart NFC card that redefines connection.',
                bn: 'BAE CARD একটি স্মার্ট NFC কার্ড যা সংযোগের ধরন বদলে দেয়।',
              })}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h5 className="mb-3 font-semibold text-fe-text">
              {translate({ en: 'Explore', bn: 'অন্বেষণ' })}
            </h5>
            <div className="flex flex-col gap-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.route ?? link.href}
                  className="text-sm text-fe-muted transition-colors hover:text-fe-accent"
                >
                  {translate(link.label)}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h5 className="mb-3 font-semibold text-fe-text">
              {translate({ en: 'Legal', bn: 'আইনি' })}
            </h5>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-fe-muted transition-colors hover:text-fe-accent">
                {translate({ en: 'Terms', bn: 'শর্তাবলী' })}
              </Link>
              <Link href="/policy" className="text-sm text-fe-muted transition-colors hover:text-fe-accent">
                {translate({ en: 'Privacy', bn: 'গোপনীয়তা' })}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h5 className="mb-3 font-semibold text-fe-text">
              {translate({ en: 'Contact', bn: 'যোগাযোগ' })}
            </h5>
            <div className="flex flex-col gap-2">
              {app.support_phone ? (
                <a
                  href={`tel:${app.support_phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm text-fe-muted transition-colors hover:text-fe-accent"
                >
                  <Phone className="size-3.5 shrink-0" />
                  <span>{app.support_phone}</span>
                </a>
              ) : null}
              {app.contact_email ? (
                <a
                  href={`mailto:${app.contact_email}`}
                  className="flex items-center gap-2 text-sm text-fe-muted transition-colors hover:text-fe-accent"
                >
                  <Mail className="size-3.5 shrink-0" />
                  <span>{app.contact_email}</span>
                </a>
              ) : null}
              {whatsappHref ? (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-sm text-fe-muted transition-colors hover:text-fe-accent"
                >
                  <MessageCircle className="size-3.5 shrink-0" />
                  <span>WhatsApp</span>
                </a>
              ) : null}
            </div>
            <div className="mt-4 flex gap-3">
              {app.facebook ? (
                <a
                  href={app.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-full border border-fe-border text-fe-muted transition-colors hover:border-fe-accent hover:text-fe-accent"
                  aria-label="Facebook"
                >
                  <Facebook className="size-4" />
                </a>
              ) : null}
              {app.instagram ? (
                <a
                  href={app.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-full border border-fe-border text-fe-muted transition-colors hover:border-fe-accent hover:text-fe-accent"
                  aria-label="Instagram"
                >
                  <Instagram className="size-4" />
                </a>
              ) : null}
              {app.linkedin ? (
                <a
                  href={app.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex size-8 items-center justify-center rounded-full border border-fe-border text-fe-muted transition-colors hover:border-fe-accent hover:text-fe-accent"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="size-4" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-fe-border pt-6 text-center text-xs text-fe-muted sm:mt-10 sm:text-sm">
          <p>
            &copy; {new Date().getFullYear()} {app.name ?? 'BAE Card'}.{' '}
            {translate({
              en: 'All rights reserved.',
              bn: 'সর্বস্বত্ব সংরক্ষিত।',
            })}
          </p>
        </div>
      </div>
    </footer>
  );
}
