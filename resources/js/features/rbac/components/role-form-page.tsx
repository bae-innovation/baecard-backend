import { router } from '@inertiajs/react';
import { Loader2, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { PermissionGroup, RoleFormMode } from '@/features/rbac/schemas/rbac.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type RoleFormPageProps = {
  mode: RoleFormMode;
  role: { id: number; name: string; is_protected: boolean } | null;
  permissionGroups: PermissionGroup;
  selectedPermissions: string[];
};

function formatGroupLabel(group: string) {
  return group.charAt(0).toUpperCase() + group.slice(1);
}

export function RoleFormPage({
  mode,
  role,
  permissionGroups,
  selectedPermissions,
}: RoleFormPageProps) {
  const [name, setName] = React.useState(role?.name ?? '');
  const [permissions, setPermissions] = React.useState<string[]>(selectedPermissions);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setName(role?.name ?? '');
    setPermissions(selectedPermissions);
  }, [role, selectedPermissions]);

  const togglePermission = (permissionName: string, checked: boolean) => {
    setPermissions((current) =>
      checked
        ? [...new Set([...current, permissionName])]
        : current.filter((item) => item !== permissionName),
    );
  };

  const toggleGroup = (groupPermissions: { name: string }[], checked: boolean) => {
    const names = groupPermissions.map((item) => item.name);
    setPermissions((current) => {
      if (checked) {
        return [...new Set([...current, ...names])];
      }

      return current.filter((item) => !names.includes(item));
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = { name, permissions };

    if (mode === 'create') {
      router.post('/access-control/roles', payload, {
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

    router.put(`/access-control/roles/${role.id}`, payload, {
      onSuccess: () => showMutationSuccess('Role updated successfully'),
      onError: () => showMutationError(null, 'Failed to update role'),
      onFinish: () => setIsSubmitting(false),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-6 py-4">
      <PageTitle
        title={mode === 'create' ? 'Create Role' : 'Edit Role'}
        icon={ShieldCheck}
        color="violet"
        description="Assign permissions to define what this role can access."
      />

      <div className="max-w-xl space-y-2">
        <Label htmlFor="role-name">Role name</Label>
        <Input
          id="role-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="e.g. Sales Manager"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-6">
        {Object.entries(permissionGroups).map(([group, groupPermissions]) => {
          const groupNames = groupPermissions.map((item) => item.name);
          const selectedCount = groupNames.filter((item) => permissions.includes(item)).length;
          const allSelected = selectedCount === groupNames.length && groupNames.length > 0;

          return (
            <section key={group} className="rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(checked) =>
                      toggleGroup(groupPermissions, checked === true)
                    }
                    disabled={isSubmitting}
                  />
                  <h2 className="text-base font-semibold">{formatGroupLabel(group)}</h2>
                </div>
                <span className="text-xs text-muted-foreground">
                  {selectedCount}/{groupNames.length} selected
                </span>
              </div>
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {groupPermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex cursor-pointer items-start gap-3 rounded-md border p-3"
                  >
                    <Checkbox
                      checked={permissions.includes(permission.name)}
                      onCheckedChange={(checked) =>
                        togglePermission(permission.name, checked === true)
                      }
                      disabled={isSubmitting}
                    />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium">{permission.label}</span>
                      <span className="block font-mono text-xs text-muted-foreground">
                        {permission.name}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
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
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.get('/access-control/roles')}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
