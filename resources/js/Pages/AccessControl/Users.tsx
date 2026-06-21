import type { ReactNode } from 'react';

import { AccessControlUsersPage } from '@/features/users/components/access-control-users-page';
import type { Role } from '@/features/roles/schemas/role.schema';
import type { AdminUser } from '@/features/users/schemas/user.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Users({
  users,
  roles,
}: {
  users: LaravelPaginator<AdminUser>;
  roles: Role[];
}) {
  return <AccessControlUsersPage users={users} roles={roles} />;
}

Users.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
