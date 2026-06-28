import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';
import * as React from 'react';

import { getActiveOfferBanners, type OfferBanner } from '@frontend/types/offer-banner';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { cn } from '@/lib/utils';

const ROTATE_MS = 5500;

type OfferBannerBarProps = {
  offers?: OfferBanner[];
  className?: string;
};

export function OfferBannerBar({ offers: offersProp, className }: OfferBannerBarProps) {
  const reducedMotion = useReducedMotion();
  const { content, translate } = useMarketingContent();
  const activeOffers = React.useMemo(
    () => getActiveOfferBanners(offersProp ?? content.offers),
    [offersProp, content.offers],
  );
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progressKey, setProgressKey] = React.useState(0);

  const count = activeOffers.length;
  const current = activeOffers[index];

  React.useEffect(() => {
    if (count <= 1 || paused || reducedMotion) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
      setProgressKey((prev) => prev + 1);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [count, paused, reducedMotion]);

  if (!current) return null;

  function handleClick(offer: OfferBanner) {
    if (!offer.href) return;
    window.location.assign(offer.href);
  }

  const message = translate(current.message);

  const contentNode = (
    <div className="relative flex min-h-10 items-center justify-center gap-2 px-4 py-2.5 text-center sm:gap-3 sm:px-6">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current.id}
          initial={reducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex max-w-4xl flex-wrap items-center justify-center gap-x-2 gap-y-1"
        >
          {current.badge ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/95 sm:text-[11px]">
              <Sparkles className="size-3 shrink-0" aria-hidden />
              {translate(current.badge)}
            </span>
          ) : null}
          <p className="text-xs font-medium leading-snug text-white sm:text-sm sm:text-[15px]">{message}</p>
          {current.href ? (
            <ChevronRight className="hidden size-4 shrink-0 text-white/80 sm:inline" aria-hidden />
          ) : null}
        </motion.div>
      </AnimatePresence>

      {count > 1 ? (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10" aria-hidden>
          <motion.div
            key={`${current.id}-${progressKey}`}
            className="h-full origin-left bg-white/70"
            initial={{ scaleX: reducedMotion ? 1 : 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: reducedMotion || paused ? 0 : ROTATE_MS / 1000,
              ease: 'linear',
            }}
          />
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        'relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#e53e3e] via-[#dc2626] to-[#e53e3e]',
        className,
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setProgressKey((prev) => prev + 1);
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.18)_50%,transparent_75%)] bg-[length:200%_100%] motion-safe:animate-offer-shine"
        aria-hidden
      />

      {current.href ? (
        <button
          type="button"
          onClick={() => handleClick(current)}
          className="relative block w-full text-left transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          aria-label={message}
        >
          {contentNode}
        </button>
      ) : (
        <div className="relative" role="status" aria-live="polite">
          {contentNode}
        </div>
      )}
    </div>
  );
}
