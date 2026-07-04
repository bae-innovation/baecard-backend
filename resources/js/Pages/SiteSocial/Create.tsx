import type { ReactNode } from 'react';

import { SiteSocialCreatePage } from '@/features/site-social/components/site-social-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create({ platforms }: { platforms?: readonly string[] }) {
  return <SiteSocialCreatePage platforms={platforms} />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
