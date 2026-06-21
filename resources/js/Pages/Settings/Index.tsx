import type { ReactNode } from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { Settings } from 'lucide-react';

import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Index() {
  return (
    <div className="space-y-6 py-4">
      <PageTitle
        title="Settings"
        description="Configure application preferences."
        icon={Settings}
        color="purple"
      />
      <p className="text-sm text-muted-foreground">
        Application settings will be available here soon.
      </p>
    </div>
  );
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
