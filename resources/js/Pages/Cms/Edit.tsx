import type { ReactNode } from 'react';

import { CmsEditPage } from '@/features/cms/components/cms-edit-page';
import type { CmsEditPageProps } from '@/features/cms/schemas/cms-entry.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit(props: CmsEditPageProps) {
  return <CmsEditPage {...props} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
