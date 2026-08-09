import type { ReactNode } from 'react';

import { RoleFormPage } from '@/features/rbac/components/role-form-page';
import type { PermissionGroup, RoleFormMode } from '@/features/rbac/schemas/rbac.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

type RoleFormProps = {
  mode: RoleFormMode;
  role: { id: number; name: string; is_protected: boolean } | null;
  permissionGroups: PermissionGroup;
  selectedPermissions: string[];
};

export default function RoleForm({
  mode,
  role,
  permissionGroups,
  selectedPermissions,
}: RoleFormProps) {
  return (
    <RoleFormPage
      mode={mode}
      role={role}
      permissionGroups={permissionGroups}
      selectedPermissions={selectedPermissions}
    />
  );
}

RoleForm.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
