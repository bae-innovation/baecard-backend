import type { ReactNode } from 'react';

import { CmsIndexPage } from '@/features/cms/components/cms-index-page';
import type { CmsEntrySummary } from '@/features/cms/schemas/cms-entry.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

type CmsIndexProps = {
  entries: CmsEntrySummary[];
};

export default function Index({ entries }: CmsIndexProps) {
  return <CmsIndexPage entries={entries} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
