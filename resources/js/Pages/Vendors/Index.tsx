import type { ReactNode } from 'react';

import { VendorsPage } from '@/features/vendors/components/vendors-page';
import type { Vendor } from '@/features/vendors/schemas/vendor.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ vendors }: { vendors: LaravelPaginator<Vendor> }) {
  return <VendorsPage vendors={vendors} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
