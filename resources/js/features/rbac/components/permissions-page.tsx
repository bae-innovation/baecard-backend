import { KeyRound } from 'lucide-react';

import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import type { PermissionGroup } from '@/features/rbac/schemas/rbac.schema';

type PermissionsPageProps = {
  permissionGroups: PermissionGroup;
};

function formatGroupLabel(group: string) {
  return group.charAt(0).toUpperCase() + group.slice(1);
}

export function PermissionsPage({ permissionGroups }: PermissionsPageProps) {
  const groups = Object.entries(permissionGroups);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-4">
      <PageTitle
        title="Permissions"
        icon={KeyRound}
        color="violet"
        description="View-only catalog of all permissions available in the system."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {groups.map(([group, permissions]) => (
          <section key={group} className="rounded-lg border bg-card">
            <div className="border-b px-4 py-3">
              <h2 className="text-lg font-semibold tracking-tight">
                {formatGroupLabel(group)}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Permission</th>
                    <th className="px-4 py-3 font-medium">Label</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 font-mono text-xs">{permission.name}</td>
                      <td className="px-4 py-3">{permission.label}</td>
                      <td className="px-4 py-3">
                        {permission.is_wildcard ? (
                          <Badge variant="secondary">Wildcard</Badge>
                        ) : (
                          <Badge variant="outline">Action</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
