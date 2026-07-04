import type { ReactNode } from 'react';

import { OfferTickersPage } from '@/features/offer-tickers/components/offer-tickers-page';
import type { OfferTicker } from '@/features/offer-tickers/schemas/offer-ticker.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({
  offerTickers,
}: {
  offerTickers: LaravelPaginator<OfferTicker>;
}) {
  return <OfferTickersPage offerTickers={offerTickers} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
