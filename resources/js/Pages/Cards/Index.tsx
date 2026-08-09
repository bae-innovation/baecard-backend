import type { ReactNode } from 'react';

import { CodesPage } from '@/features/cards/components/codes-page';
import type { CardCode, CardCustomerOption } from '@/features/cards/schemas/card-code.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Cards({
  codes,
  customers,
}: {
  codes: LaravelPaginator<CardCode>;
  customers: CardCustomerOption[];
}) {
  return <CodesPage codes={codes} customers={customers} />;
}

Cards.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
