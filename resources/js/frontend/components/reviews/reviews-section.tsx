import { BadgeCheck, Star } from 'lucide-react';

import { SectionShell } from '@frontend/components/blocks/section-shell';
import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingReview } from '@frontend/types/marketing';

type ReviewsSectionProps = {
  reviews: MarketingReview[];
};

function ReviewCard({ review }: { review: MarketingReview }) {
  const initials = review.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <MarketingCard className="h-full text-center transition-colors hover:border-fe-accent/50">
      <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full bg-fe-accent/20 text-xl font-bold text-fe-accent">
        {initials}
      </div>
      <h3 className="mb-2 flex items-center justify-center gap-1 font-semibold text-fe-text">
        {review.name}
        <BadgeCheck className="size-4 text-blue-400" />
      </h3>
      <p className="mb-3 text-sm text-fe-muted">{review.body}</p>
      <div className="flex justify-center gap-0.5">
        {Array.from({ length: review.rating }).map((_, i) => (
          <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
        ))}
      </div>
    </MarketingCard>
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
        <>
          <div className="fe-snap-x-mandatory fe-scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:hidden">
            {reviews.map((review) => (
              <div key={review.id} className="fe-snap-center w-[80vw] max-w-xs shrink-0">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
          <StaggerContainer className="hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {reviews.map((review) => (
              <StaggerItem key={review.id}>
                <ReviewCard review={review} />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </>
      )}
    </SectionShell>
  );
}
