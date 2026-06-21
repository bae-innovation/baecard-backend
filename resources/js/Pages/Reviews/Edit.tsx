import type { ReactNode } from 'react';

import { ReviewEditPage } from '@/features/reviews/components/review-edit-page';
import type { Review } from '@/features/reviews/schemas/review.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ review }: { review: Review }) {
  return <ReviewEditPage review={review} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
