import type { ReactNode } from 'react';

import { VendorEditPage } from '@/features/vendors/components/vendor-edit-page';
import type { Vendor } from '@/features/vendors/schemas/vendor.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({ vendor }: { vendor: Vendor }) {
  return <VendorEditPage vendor={vendor} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
