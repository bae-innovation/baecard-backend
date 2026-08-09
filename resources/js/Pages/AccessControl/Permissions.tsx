import type { ReactNode } from 'react';

import { PermissionsPage } from '@/features/rbac/components/permissions-page';
import type { PermissionGroup } from '@/features/rbac/schemas/rbac.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

type PermissionsIndexProps = {
  permissionGroups: PermissionGroup;
};

export default function Permissions({ permissionGroups }: PermissionsIndexProps) {
  return <PermissionsPage permissionGroups={permissionGroups} />;
}

Permissions.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
