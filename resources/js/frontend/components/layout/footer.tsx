import { Link } from '@inertiajs/react';

import { frontendAsset } from '@frontend/lib/brand';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { useAppSettings } from '@/hooks/useAppSettings';

export function Footer() {
  const app = useAppSettings();
  const { content, translate } = useMarketingContent();

  return (
    <footer className="border-t border-fe-border bg-fe-surface py-10 sm:py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:gap-10 sm:px-5 md:px-6 lg:grid-cols-4">
        <div>
          <img src={frontendAsset('BAE CARD White.svg')} alt="BAE Card" className="mb-4 h-10 invert dark:invert-0" />
          <p className="text-sm leading-relaxed text-fe-muted">
            {translate({
              en: 'Our revolutionary BAE CARD is a Smart NFC card that redefines connection.',
              bn: 'BAE CARD একটি স্মার্ট NFC কার্ড যা সংযোগের ধরন বদলে দেয়।',
            })}
          </p>
        </div>
        <div>
          <h5 className="mb-3 font-semibold text-fe-text">
            {translate({ en: 'Explore', bn: 'অন্বেষণ' })}
          </h5>
          {content.navigation.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.route ?? link.href}
              className="mb-2 block text-sm text-fe-muted transition-colors hover:text-fe-accent"
            >
              {translate(link.label)}
            </Link>
          ))}
        </div>
        <div>
          <h5 className="mb-3 font-semibold text-fe-text">
            {translate({ en: 'Legal', bn: 'আইনি' })}
          </h5>
          <Link href="/terms" className="mb-2 block text-sm text-fe-muted hover:text-fe-accent">
            {translate({ en: 'Terms', bn: 'শর্তাবলী' })}
          </Link>
          <Link href="/policy" className="mb-2 block text-sm text-fe-muted hover:text-fe-accent">
            {translate({ en: 'Privacy', bn: 'গোপনীয়তা' })}
          </Link>
        </div>
        <div>
          <h5 className="mb-3 font-semibold text-fe-text">
            {translate({ en: 'Contact', bn: 'যোগাযোগ' })}
          </h5>
          {app.support_phone ?? app.phone ? (
            <a
              href={`tel:${app.support_phone ?? app.phone}`}
              className="mb-2 block text-sm text-fe-muted hover:text-fe-accent"
            >
              {app.support_phone ?? app.phone}
            </a>
          ) : null}
          {app.contact_email ?? app.email ? (
            <a
              href={`mailto:${app.contact_email ?? app.email}`}
              className="mb-2 block text-sm text-fe-muted hover:text-fe-accent"
            >
              {app.contact_email ?? app.email}
            </a>
          ) : null}
          <div className="mt-4 flex gap-3">
            {app.facebook ? (
              <a href={app.facebook} target="_blank" rel="noreferrer" className="text-fe-muted hover:text-fe-accent">
                FB
              </a>
            ) : null}
            {app.instagram ? (
              <a href={app.instagram} target="_blank" rel="noreferrer" className="text-fe-muted hover:text-fe-accent">
                IG
              </a>
            ) : null}
            {app.linkedin ? (
              <a href={app.linkedin} target="_blank" rel="noreferrer" className="text-fe-muted hover:text-fe-accent">
                IN
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
