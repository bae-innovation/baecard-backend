import type { ReactNode } from 'react';

import { RolesPage } from '@/features/roles/components/roles-page';
import type { Role } from '@/features/roles/schemas/role.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Roles({ roles }: { roles: LaravelPaginator<Role> }) {
  return <RolesPage roles={roles} />;
}

Roles.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
