import type { ReactNode } from 'react';

import { OfferTickerCreatePage } from '@/features/offer-tickers/components/offer-ticker-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <OfferTickerCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
