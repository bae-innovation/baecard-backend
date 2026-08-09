import type { ReactNode } from 'react';

import { DashboardPage } from '@/features/dashboard/components/dashboard-page';
import type { DashboardStats } from '@/features/dashboard/schemas/dashboard.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

type DashboardIndexProps = {
  stats: DashboardStats;
};

export default function Index({ stats }: DashboardIndexProps) {
  return <DashboardPage stats={stats} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
