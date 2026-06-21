import type { ReactNode } from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { BadgeCheck } from 'lucide-react';

import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Account() {
  return (
    <div className="space-y-6 py-4">
      <PageTitle
        title="Account"
        description="Manage your profile settings."
        icon={BadgeCheck}
        color="indigo"
      />
      <p className="text-sm text-muted-foreground">
        Account settings will be available here soon.
      </p>
    </div>
  );
}

Account.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
