import type { ReactNode } from 'react';

import { ReviewsPage } from '@/features/reviews/components/reviews-page';
import type { Review } from '@/features/reviews/schemas/review.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ reviews }: { reviews: LaravelPaginator<Review> }) {
  return <ReviewsPage reviews={reviews} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
