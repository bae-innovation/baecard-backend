import * as React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { BadgeCheck, ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { PublicReviewForm } from '@frontend/components/reviews/public-review-form';
import { SectionShell } from '@frontend/components/blocks/section-shell';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingReview } from '@frontend/types/marketing';
import { cn } from '@/lib/utils';

type ReviewsSectionProps = {
  reviews: MarketingReview[];
};

function reviewerInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function ReviewerAvatar({ review }: { review: MarketingReview }) {
  const initials = reviewerInitials(review.name);

  if (review.image_url) {
    return (
      <img
        src={review.image_url}
        alt={review.name}
        className="mx-auto mb-4 size-20 rounded-full border-2 border-fe-accent/30 object-cover shadow-[0_8px_24px_color-mix(in_srgb,var(--fe-accent)_20%,transparent)] transition-transform duration-300 group-hover:scale-105 group-hover:border-fe-accent/55"
        loading="lazy"
      />
    );
  }

  return (
    <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full border-2 border-fe-accent/20 bg-fe-accent/15 text-xl font-bold text-fe-accent transition-transform duration-300 group-hover:scale-105 group-hover:border-fe-accent/50 group-hover:bg-fe-accent/25">
      {initials}
    </div>
  );
}

function ReviewCard({ review }: { review: MarketingReview }) {
  return (
    <MarketingCard
      className={cn(
        'group relative h-full overflow-hidden text-center transition-[border-color,box-shadow,transform] duration-300',
        'hover:-translate-y-1 hover:border-fe-accent/50',
        'hover:shadow-[0_20px_56px_color-mix(in_srgb,var(--fe-accent)_22%,transparent)]',
      )}
    >
      <ReviewerAvatar review={review} />
      <h3 className="mb-2 flex items-center justify-center gap-1 font-semibold text-fe-text transition-colors duration-300 group-hover:text-fe-accent">
        {review.name}
        <BadgeCheck className="size-4 text-blue-400" />
      </h3>
      <p className="mb-3 line-clamp-4 text-sm leading-relaxed text-fe-muted">{review.body}</p>
      <div className="flex justify-center gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-amber-400 text-amber-400 transition-transform duration-300 group-hover:scale-110"
          />
        ))}
      </div>
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-fe-accent transition-transform duration-500 group-hover:scale-x-100"
        aria-hidden
      />
    </MarketingCard>
  );
}

function ReviewsSlider({ reviews }: { reviews: MarketingReview[] }) {
  const { translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    direction: 'rtl',
    loop: reviews.length > 1,
    align: 'start',
    skipSnaps: false,
  });

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('reInit', () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      onSelect();
    });
    emblaApi.on('select', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, onSelect]);

  React.useEffect(() => {
    if (!emblaApi || reducedMotion || paused || reviews.length < 2) return;

    const id = window.setInterval(() => {
      emblaApi.scrollNext();
    }, 4500);

    return () => window.clearInterval(id);
  }, [emblaApi, paused, reducedMotion, reviews.length]);

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const showControls = reviews.length > 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      <div className="relative px-10 sm:px-12">
        <div className="overflow-hidden" ref={emblaRef} dir="rtl">
          <div className="-ml-4 flex touch-pan-y">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="min-w-0 shrink-0 grow-0 basis-[85%] py-2 pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {showControls ? (
          <>
            <button
              type="button"
              onClick={scrollNext}
              aria-label={translate({ en: 'Previous reviews', bn: 'আগের রিভিউ' })}
              className={cn(
                'absolute left-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full',
                'border border-fe-border bg-fe-surface/90 text-fe-text shadow-lg backdrop-blur-sm',
                'transition-[border-color,background-color,color,transform,box-shadow] duration-300',
                'hover:scale-110 hover:border-fe-accent/55 hover:bg-fe-accent/15 hover:text-fe-accent',
                'hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--fe-accent)_28%,transparent)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-accent/60',
                'active:scale-95',
              )}
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={scrollPrev}
              aria-label={translate({ en: 'Next reviews', bn: 'পরের রিভিউ' })}
              className={cn(
                'absolute right-0 top-1/2 z-20 flex size-10 -translate-y-1/2 items-center justify-center rounded-full',
                'border border-fe-border bg-fe-surface/90 text-fe-text shadow-lg backdrop-blur-sm',
                'transition-[border-color,background-color,color,transform,box-shadow] duration-300',
                'hover:scale-110 hover:border-fe-accent/55 hover:bg-fe-accent/15 hover:text-fe-accent',
                'hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--fe-accent)_28%,transparent)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-accent/60',
                'active:scale-95',
              )}
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </>
        ) : null}
      </div>

      {showControls ? (
        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label={translate({ en: 'Review slides', bn: 'রিভিউ স্লাইড' })}
        >
          {scrollSnaps.map((_, index) => {
            const active = index === selectedIndex;
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={translate({
                  en: `Go to review ${index + 1}`,
                  bn: `রিভিউ ${index + 1}-এ যান`,
                })}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'h-2.5 rounded-full transition-all duration-300',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-accent/60',
                  active
                    ? 'w-7 bg-fe-accent shadow-[0_0_16px_color-mix(in_srgb,var(--fe-accent)_55%,transparent)]'
                    : 'w-2.5 bg-fe-muted/35 hover:scale-125 hover:bg-fe-accent/55',
                )}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const { content, translate } = useMarketingContent();

  return (
    <SectionShell id="reviews">
      <SectionHeading
        title={translate(content.sectionHeadings.reviews.title)}
        subtitle={translate(content.sectionHeadings.reviews.subtitle)}
      />
      {reviews.length === 0 ? (
        <p className="text-center text-fe-muted">
          {translate({ en: 'Reviews coming soon.', bn: 'শীঘ্রই রিভিউ আসছে।' })}
        </p>
      ) : (
        <ReviewsSlider reviews={reviews} />
      )}
      <div className="mt-10 sm:mt-12">
        <PublicReviewForm />
      </div>
    </SectionShell>
  );
}
