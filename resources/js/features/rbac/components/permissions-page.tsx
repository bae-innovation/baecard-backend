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
    <div className="flex min-h-0 flex-1 flex-col gap-3 py-3">
      <PageTitle
        title="Permissions"
        icon={KeyRound}
        compact
        description="View-only catalog of all permissions available in the system."
      />

      <div className="grid grid-cols-1 items-start gap-3 lg:grid-cols-2">
        {groups.map(([group, permissions]) => (
          <section key={group} className="h-fit w-full rounded-md border bg-card">
            <div className="border-b px-3 py-2">
              <h2 className="text-base font-semibold tracking-tight">
                {formatGroupLabel(group)}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm leading-tight">
                <thead>
                  <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                    <th className="px-2.5 py-1.5 font-medium">Permission</th>
                    <th className="px-2.5 py-1.5 font-medium">Label</th>
                    <th className="w-24 px-2.5 py-1.5 font-medium">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr
                      key={permission.id}
                      className="border-b last:border-b-0 hover:bg-muted/30"
                    >
                      <td className="px-2.5 py-1.5 font-mono text-xs">{permission.name}</td>
                      <td className="px-2.5 py-1.5">{permission.label}</td>
                      <td className="px-2.5 py-1.5">
                        {permission.is_wildcard ? (
                          <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                            Wildcard
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="h-5 px-1.5 text-xs">
                            Action
                          </Badge>
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
