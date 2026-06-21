import type { ReactNode } from 'react';

import { ReviewCreatePage } from '@/features/reviews/components/review-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <ReviewCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
