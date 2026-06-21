import type { ReactNode } from 'react';

import { UsersManagementPage } from '@/features/users/components/users-management-page';
import type { AdminUser } from '@/features/users/schemas/user.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({ users }: { users: LaravelPaginator<AdminUser> }) {
  return <UsersManagementPage users={users} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
