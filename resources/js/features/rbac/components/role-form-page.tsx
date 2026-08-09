import { router } from '@inertiajs/react';
import { Loader2, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { PageBackButton } from '@/components/shared/page-back-button';
import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PermissionGroup, RoleFormMode } from '@/features/rbac/schemas/rbac.schema';
import {
  applyGroupToggle,
  applyPermissionToggle,
  flattenPermissionNames,
  isPermissionSelected,
} from '@/features/rbac/lib/permission-selection';
import { usePageBack } from '@/hooks/usePageBack';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type RoleFormPageProps = {
  mode: RoleFormMode;
  role: { id: number; name: string; is_protected: boolean } | null;
  permissionGroups: PermissionGroup;
  selectedPermissions: string[];
};

const ROLES_INDEX_PATH = '/access-control/roles';

function formatGroupLabel(group: string) {
  return group.charAt(0).toUpperCase() + group.slice(1);
}

export function RoleFormPage({
  mode,
  role,
  permissionGroups,
  selectedPermissions,
}: RoleFormPageProps) {
  const goBack = usePageBack(ROLES_INDEX_PATH);
  const [name, setName] = React.useState(role?.name ?? '');
  const [permissions, setPermissions] = React.useState<string[]>(selectedPermissions);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const allPermissionNames = React.useMemo(
    () => flattenPermissionNames(permissionGroups),
    [permissionGroups],
  );

  React.useEffect(() => {
    setName(role?.name ?? '');
    setPermissions(selectedPermissions);
  }, [role, selectedPermissions]);

  const togglePermission = (
    permission: { name: string; is_wildcard: boolean },
    groupPermissions: { name: string; is_wildcard: boolean }[],
    checked: boolean,
  ) => {
    setPermissions((current) =>
      applyPermissionToggle(current, permission, groupPermissions, checked, allPermissionNames),
    );
  };

  const toggleGroup = (
    groupPermissions: { name: string; is_wildcard: boolean }[],
    checked: boolean,
  ) => {
    setPermissions((current) =>
      applyGroupToggle(current, groupPermissions, checked, allPermissionNames),
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = { name, permissions };

    if (mode === 'create') {
      router.post(ROLES_INDEX_PATH, payload, {
        onSuccess: () => showMutationSuccess('Role created successfully'),
        onError: () => showMutationError(null, 'Failed to create role'),
        onFinish: () => setIsSubmitting(false),
      });
      return;
    }

    if (!role) {
      setIsSubmitting(false);
      return;
    }

    router.put(`${ROLES_INDEX_PATH}/${role.id}`, payload, {
      onSuccess: () => showMutationSuccess('Role updated successfully'),
      onError: () => showMutationError(null, 'Failed to update role'),
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <PageTitle
          title={mode === 'create' ? 'Create Role' : 'Edit Role'}
          description={
            mode === 'create'
              ? 'Assign permissions to define what this role can access.'
              : 'Update the role name and permissions.'
          }
          icon={ShieldCheck}
          compact
          className="min-w-0 flex-1"
        />
        <PageBackButton fallbackHref={ROLES_INDEX_PATH} label="Back to Roles" className="shrink-0" />
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
        <div className="max-w-md space-y-1.5">
          <Label htmlFor="role-name" className="text-sm">
            Role name
          </Label>
          <Input
            id="role-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Sales Manager"
            className="h-9 text-sm"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(permissionGroups).map(([group, groupPermissions]) => {
            const selectedCount = groupPermissions.filter((item) =>
              isPermissionSelected(item.name, permissions, groupPermissions),
            ).length;
            const allSelected =
              selectedCount === groupPermissions.length && groupPermissions.length > 0;

            return (
              <section key={group} className="h-fit w-full rounded-md border bg-card">
                <div className="flex items-center justify-between border-b px-3 py-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        toggleGroup(groupPermissions, checked === true)
                      }
                      disabled={isSubmitting}
                    />
                    <h2 className="truncate text-base font-semibold tracking-tight">
                      {formatGroupLabel(group)}
                    </h2>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {selectedCount}/{groupPermissions.length}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm leading-tight">
                    <thead>
                      <tr className="border-b bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="w-10 px-2 py-1.5" aria-label="Select permission" />
                        <th className="px-2.5 py-1.5 font-medium">Permission</th>
                        <th className="px-2.5 py-1.5 font-medium">Label</th>
                        <th className="w-24 px-2.5 py-1.5 font-medium">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupPermissions.map((permission) => (
                        <tr
                          key={permission.id}
                          className="border-b last:border-b-0 hover:bg-muted/30"
                        >
                          <td className="px-2 py-1.5 align-middle">
                            <Checkbox
                              checked={isPermissionSelected(
                                permission.name,
                                permissions,
                                groupPermissions,
                              )}
                              onCheckedChange={(checked) =>
                                togglePermission(permission, groupPermissions, checked === true)
                              }
                              disabled={isSubmitting}
                              aria-label={`Select ${permission.label}`}
                            />
                          </td>
                          <td className="px-2.5 py-1.5 font-mono text-xs">
                            {permission.name}
                          </td>
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
            );
          })}
        </div>

        <div className="sticky bottom-0 flex items-center gap-2 border-t bg-background pt-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Saving...
              </>
            ) : mode === 'create' ? (
              'Create role'
            ) : (
              'Save changes'
            )}
          </Button>
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={goBack}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
