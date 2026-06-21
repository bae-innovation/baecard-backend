import type { ReactNode } from 'react';

import { UsersManagementPage } from '@/features/users/components/users-management-page';
import type { AdminUser } from '@/features/users/schemas/user.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({
  customers,
}: {
  customers: LaravelPaginator<AdminUser>;
}) {
  return <UsersManagementPage users={customers} variant="customers" />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
