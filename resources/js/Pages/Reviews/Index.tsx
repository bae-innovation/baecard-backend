import type { ReactNode } from 'react';

import { ReviewsPage } from '@/features/reviews/components/reviews-page';
import type { Review } from '@/features/reviews/schemas/review.schema';
import PortalLayout from '@/Layouts/PortalLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ reviews }: { reviews: LaravelPaginator<Review> }) {
  return <ReviewsPage reviews={reviews} />;
}

Index.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
