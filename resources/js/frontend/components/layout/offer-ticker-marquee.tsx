import { ChevronRight, Sparkles } from 'lucide-react';
import * as React from 'react';

import {
  getActiveOfferBanners,
  OFFER_TICKER_THEME_GRADIENTS,
  resolveOfferTheme,
  type OfferBanner,
} from '@frontend/types/offer-banner';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { cn } from '@/lib/utils';

type OfferTickerMarqueeProps = {
  offers?: OfferBanner[];
  className?: string;
};

function TickerSegment({
  offer,
  translate,
}: {
  offer: OfferBanner;
  translate: (value: { en: string; bn: string }) => string;
}) {
  const theme = resolveOfferTheme(offer.theme);
  const message = translate(offer.message);
  const content = (
    <span className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 shadow-lg ring-1 ring-white/20 sm:gap-3 sm:px-5">
      {offer.badge ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm sm:text-[11px]">
          <Sparkles className="size-3 shrink-0" aria-hidden />
          {translate(offer.badge)}
        </span>
      ) : null}
      <span className="whitespace-nowrap text-xs font-semibold text-white sm:text-sm">
        {message}
      </span>
      {offer.href ? (
        <ChevronRight className="size-4 shrink-0 text-white/85" aria-hidden />
      ) : null}
      <span className="mx-3 inline-block size-1 shrink-0 rounded-full bg-white/30 sm:mx-5" aria-hidden />
    </span>
  );

  if (offer.href) {
    return (
      <a
        href={offer.href}
        className="inline-flex shrink-0 px-1 py-2 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        aria-label={message}
      >
        <span
          className="inline-flex shrink-0 rounded-full"
          style={{ background: OFFER_TICKER_THEME_GRADIENTS[theme] }}
        >
          {content}
        </span>
      </a>
    );
  }

  return (
    <span className="inline-flex shrink-0 px-1 py-2">
      <span
        className="inline-flex shrink-0 rounded-full"
        style={{ background: OFFER_TICKER_THEME_GRADIENTS[theme] }}
      >
        {content}
      </span>
    </span>
  );
}

export function OfferTickerMarquee({ offers: offersProp, className }: OfferTickerMarqueeProps) {
  const reducedMotion = useReducedMotion();
  const { content, translate } = useMarketingContent();
  const activeOffers = React.useMemo(
    () => getActiveOfferBanners(offersProp ?? content.offers),
    [offersProp, content.offers],
  );
  const [paused, setPaused] = React.useState(false);

  if (activeOffers.length === 0) {
    return null;
  }

  const loopItems = [...activeOffers, ...activeOffers];

  if (reducedMotion) {
    return (
      <div
        className={cn(
          'relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#e53e3e] via-[#dc2626] to-[#f97316]',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 py-2.5">
          {activeOffers.map((offer) => (
            <TickerSegment key={offer.id} offer={offer} translate={translate} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative overflow-hidden border-b border-white/15 bg-[#0f172a] shadow-[0_4px_24px_-8px_rgba(124,58,237,0.35)]',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.16)_50%,transparent_75%)] bg-[length:200%_100%] motion-safe:animate-offer-shine"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
        aria-hidden
      />

      <div className="relative flex min-h-10 items-center overflow-hidden">
        <div
          className={cn(
            'flex w-max items-center motion-safe:animate-offer-marquee',
            paused && 'motion-safe:[animation-play-state:paused]',
          )}
          role="marquee"
          aria-live="off"
        >
          {loopItems.map((offer, index) => (
            <TickerSegment
              key={`${offer.id}-${index}`}
              offer={offer}
              translate={translate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
