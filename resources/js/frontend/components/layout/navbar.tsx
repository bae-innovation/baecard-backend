import { Link, usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, MessageCircle, X } from 'lucide-react';
import * as React from 'react';

import { LanguageToggle } from '@frontend/components/layout/language-toggle';
import { ThemeToggle } from '@frontend/components/layout/theme-toggle';
import { MarketingButton } from '@frontend/components/ui/marketing-button';
import { useActionHub } from '@frontend/hooks/use-action-hub';
import { useBodyScrollLock } from '@frontend/hooks/use-body-scroll-lock';
import { frontendAsset } from '@frontend/lib/brand';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { useAppSettings } from '@/hooks/useAppSettings';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { openHub } = useActionHub();
  const { content, translate } = useMarketingContent();
  const app = useAppSettings();
  const page = usePage<{ auth: { user: { name: string } | null } }>();
  const { auth } = page.props;
  const url = page.url;
  const whatsappNumber = app.whatsapp ?? app.support_phone;
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber.replace(/\D/g, '')}`
    : null;

  useBodyScrollLock(mobileOpen);

  React.useEffect(() => {
    setMobileOpen(false);
  }, [url]);

  function isActive(href: string) {
    const current = url.split('?')[0] ?? '/';
    if (href === '/') return current === '/';
    return current.startsWith(href);
  }

  return (
    <nav className="border-b border-fe-border bg-fe-nav backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:py-3 md:px-6">
        <Link href="/" className="fe-touch shrink-0">
          <img
            src={frontendAsset('BAE CARD White.svg')}
            alt="BAE Card"
            className="h-9 w-auto sm:h-10 dark:invert-0 invert"
          />
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {content.navigation.map((link) => {
            const href = link.route ?? link.href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-fe-accent',
                  isActive(href) ? 'text-fe-accent' : 'text-fe-text',
                )}
              >
                {translate(link.label)}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <ThemeToggle />
          {auth.user ? (
            <Link href="/dashboard">
              <MarketingButton size="sm" variant="solid">
                Dashboard
              </MarketingButton>
            </Link>
          ) : (
            <Link href="/login">
              <MarketingButton size="sm" variant="ghost">
                Login
              </MarketingButton>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-1.5 lg:hidden">
          <LanguageToggle />
          <ThemeToggle />
          <button
            type="button"
            className="fe-touch inline-flex size-11 items-center justify-center rounded-full text-fe-text active:bg-fe-border/30"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="fixed inset-y-0 right-0 z-[60] flex w-[min(100%,22rem)] flex-col border-l border-fe-border bg-fe-surface shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="flex items-center justify-between border-b border-fe-border px-4 py-3">
                <span className="text-sm font-semibold text-fe-text">Menu</span>
                <button
                  type="button"
                  className="fe-touch inline-flex size-10 items-center justify-center rounded-full text-fe-text"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 pb-8">
                <div className="flex flex-col gap-0.5">
                  {content.navigation.map((link) => {
                    const href = link.route ?? link.href;
                    const active = isActive(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'fe-touch rounded-xl px-4 py-3 text-sm font-medium transition-colors active:scale-[0.99]',
                          active
                            ? 'bg-fe-accent/15 text-fe-accent'
                            : 'text-fe-text hover:bg-fe-border/20 active:bg-fe-border/40',
                        )}
                      >
                        {translate(link.label)}
                      </Link>
                    );
                  })}
                </div>
                <div className="mt-5 grid gap-2 border-t border-fe-border pt-5">
                  {whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      <MarketingButton className="w-full" variant="solid">
                        <MessageCircle className="size-4" />
                        {translate({ en: 'WhatsApp', bn: 'হোয়াটসঅ্যাপ' })}
                      </MarketingButton>
                    </a>
                  ) : (
                    <MarketingButton
                      className="w-full"
                      variant="solid"
                      onClick={() => {
                        openHub('message');
                        setMobileOpen(false);
                      }}
                    >
                      {translate({ en: 'Message Us', bn: 'মেসেজ করুন' })}
                    </MarketingButton>
                  )}
                  <Link href="/appointment" className="w-full" onClick={() => setMobileOpen(false)}>
                    <MarketingButton className="w-full" variant="ghost">
                      {translate({ en: 'Book Appointment', bn: 'অ্যাপয়েন্টমেন্ট' })}
                    </MarketingButton>
                  </Link>
                  {auth.user ? (
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <MarketingButton className="w-full" variant="outline">
                        Dashboard
                      </MarketingButton>
                    </Link>
                  ) : (
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <MarketingButton className="w-full" variant="outline">
                        Login
                      </MarketingButton>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}
