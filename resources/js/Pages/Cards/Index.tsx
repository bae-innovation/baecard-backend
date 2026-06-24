import type { ReactNode } from 'react';

import { CodesPage } from '@/features/cards/components/codes-page';
import type { CardCode } from '@/features/cards/schemas/card-code.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Cards({ codes }: { codes: LaravelPaginator<CardCode> }) {
  return <CodesPage codes={codes} />;
}

Cards.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
