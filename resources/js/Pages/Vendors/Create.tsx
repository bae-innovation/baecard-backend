import type { ReactNode } from 'react';

import { VendorCreatePage } from '@/features/vendors/components/vendor-create-page';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Create() {
  return <VendorCreatePage />;
}

Create.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
