import { motion } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

const ENTER_MS = 150;
const EXIT_FADE_MS = 200;

type StripMode = 'indeterminate' | 'sweep';

/**
 * 3px indeterminate bar on the top inner edge of a table card; for
 * `isFetchingNextPage` (cursor chunk backfill). Exit: sweep right, then fade out.
 */
export function DataTableChunkProgress({
  isFetchingNextPage,
}: {
  isFetchingNextPage: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);
  const [strip, setStrip] = React.useState<StripMode>('indeterminate');
  const [fadingOut, setFadingOut] = React.useState(false);

  React.useEffect(() => {
    if (isFetchingNextPage) {
      setMounted(true);
      setStrip('indeterminate');
      setFadingOut(false);
      return;
    }

    setStrip((current) =>
      current === 'indeterminate' && mounted ? 'sweep' : current,
    );
  }, [isFetchingNextPage, mounted]);

  const onSweepFinish = React.useCallback(() => {
    if (strip !== 'sweep') return;
    setFadingOut(true);
  }, [strip]);

  React.useEffect(() => {
    if (!fadingOut) return;
    const t = window.setTimeout(() => {
      setMounted(false);
      setFadingOut(false);
      setStrip('indeterminate');
    }, EXIT_FADE_MS);
    return () => window.clearTimeout(t);
  }, [fadingOut]);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 h-[3px] overflow-hidden rounded-t-[inherit]"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{
        duration: fadingOut ? EXIT_FADE_MS / 1000 : ENTER_MS / 1000,
        ease: fadingOut ? 'easeIn' : 'easeOut',
      }}
      aria-hidden
    >
      <div
        className={cn(
          'h-full w-[42%] rounded-full bg-primary will-change-transform',
          strip === 'indeterminate' && 'data-table-chunk-bar-indeterminate',
          strip === 'sweep' && 'data-table-chunk-bar-sweep',
        )}
        style={{
          transformOrigin: 'left center',
          boxShadow:
            '0 0 14px hsl(var(--primary) / 0.45), 0 0 5px hsl(var(--primary) / 0.35), 0 0 1px hsl(var(--primary) / 0.9)',
        }}
        onAnimationEnd={strip === 'sweep' ? onSweepFinish : undefined}
      />
    </motion.div>
  );
}

const FOOTER_PILL_MIN_W = '10rem';

/** Reserved-width footer pill; fades with chunk fetch (100ms). */
export function DataTableLoadingMorePill({ visible }: { visible: boolean }) {
  return (
    <div
      className="flex min-h-[1.25rem] items-center"
      style={{ minWidth: FOOTER_PILL_MIN_W }}
    >
      <motion.div
        className="inline-flex max-w-full items-baseline gap-0.5 rounded-full border border-primary/25 bg-primary/10 px-2.5 py-0.5 text-xs font-medium leading-none text-primary shadow-sm"
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        aria-live="polite"
        role="status"
        style={{ pointerEvents: visible ? 'auto' : 'none' }}
      >
        <span className="whitespace-nowrap">Loading more</span>
        <span className="inline-flex gap-px" aria-hidden>
          <span className="data-table-loading-ellipsis-dot inline-block">
            .
          </span>
          <span className="data-table-loading-ellipsis-dot inline-block">
            .
          </span>
          <span className="data-table-loading-ellipsis-dot inline-block">
            .
          </span>
        </span>
      </motion.div>
    </div>
  );
}
