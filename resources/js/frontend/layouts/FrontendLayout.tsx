import * as React from 'react';
import { useTheme } from 'next-themes';

import { ActionHub } from '@frontend/components/actions/action-hub';
import { PageContactBlock, type PageContactVariant } from '@frontend/components/blocks/page-contact-block';
import { PageHero } from '@frontend/components/blocks/page-hero';
import { Footer } from '@frontend/components/layout/footer';
import { FloatingActions } from '@frontend/components/layout/floating-actions';
import { MobileActionBar } from '@frontend/components/layout/mobile-action-bar';
import { Navbar } from '@frontend/components/layout/navbar';
import { OfferTickerMarquee } from '@frontend/components/layout/offer-ticker-marquee';
import { ActionHubProvider } from '@frontend/hooks/use-action-hub';
import { CartProvider } from '@frontend/providers/cart-provider';
import { LocaleProvider } from '@frontend/providers/locale-provider';
import { MarketingContentProvider, useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent, CmsPageSlug } from '@frontend/types/marketing-content';
import type { MarketingProduct } from '@frontend/types/marketing';
import { AppHead } from '@/components/shared/app-head';

type FrontendLayoutProps = {
  title?: string;
  children: React.ReactNode;
  products?: MarketingProduct[];
  marketing?: MarketingContent | null;
  contactVariant?: PageContactVariant;
  showContactBlock?: boolean;
  pageSlug?: CmsPageSlug;
};

function FrontendLayoutInner({
  title,
  children,
  products = [],
  marketing,
  contactVariant = 'home',
  showContactBlock = true,
  pageSlug,
}: FrontendLayoutProps) {
  const { resolvedTheme } = useTheme();
  const { content, translate } = useMarketingContent();
  const themeClass = resolvedTheme === 'light' ? 'light' : '';

  const resolvedTitle =
    title ??
    (pageSlug && content.seo[pageSlug]
      ? translate(content.seo[pageSlug].title)
      : page
        ? translate(page.title)
        : undefined);

  const page = pageSlug ? content.pages[pageSlug] : null;

  return (
    <>
      <AppHead title={resolvedTitle ?? 'BAE Card'} />
      <div
        className={`frontend-site fe-app-shell min-h-dvh bg-fe-bg font-[Poppins,sans-serif] text-fe-text ${themeClass}`}
      >
        <header className="fe-safe-top sticky top-0 z-40">
          <OfferTickerMarquee offers={marketing?.offers ?? content.offers} />
          <Navbar />
        </header>
        <main>
          {page ? (
            <PageHero
              title={translate(page.title)}
              subtitle={page.subtitle ? translate(page.subtitle) : undefined}
              breadcrumb={[
                { label: translate({ en: 'Home', bn: 'হোম' }), href: '/' },
                { label: translate(page.title) },
              ]}
            />
          ) : null}
          {children}
          {showContactBlock ? (
            <PageContactBlock variant={contactVariant ?? (pageSlug as PageContactVariant) ?? 'home'} />
          ) : null}
        </main>
        <Footer />
        <FloatingActions />
        <MobileActionBar />
        <ActionHub products={products} />
      </div>
    </>
  );
}

export function FrontendLayout(props: FrontendLayoutProps) {
  return (
    <LocaleProvider>
      <MarketingContentProvider content={props.marketing}>
        <CartProvider>
          <ActionHubProvider>
            <FrontendLayoutInner {...props} />
          </ActionHubProvider>
        </CartProvider>
      </MarketingContentProvider>
    </LocaleProvider>
  );
}
