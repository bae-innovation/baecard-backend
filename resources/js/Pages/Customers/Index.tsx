import type { ReactNode } from 'react';

import { CustomersPage } from '@/features/customers/components/customers-page';
import type { Customer } from '@/features/customers/schemas/customer.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({
  customers,
}: {
  customers: LaravelPaginator<Customer>;
}) {
  return <CustomersPage customers={customers} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
