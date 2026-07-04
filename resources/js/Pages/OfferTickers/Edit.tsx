import type { ReactNode } from 'react';

import { OfferTickerEditPage } from '@/features/offer-tickers/components/offer-ticker-edit-page';
import type { OfferTicker } from '@/features/offer-tickers/schemas/offer-ticker.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ offerTicker }: { offerTicker: OfferTicker }) {
  return <OfferTickerEditPage offerTicker={offerTicker} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
