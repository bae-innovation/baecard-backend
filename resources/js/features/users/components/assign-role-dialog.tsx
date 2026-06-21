import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { RoleBadges } from '@/components/shared/role-badges';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role } from '@/features/roles/schemas/role.schema';
import {
  assignRoleFormSchema,
  type AdminUser,
  type AssignRoleFormValues,
  getUserRoleNames,
} from '@/features/users/schemas/user.schema';
import { useAuth } from '@/hooks/useAuth';
import { getAssignableRoleNames } from '@/lib/role-assignment';

type AssignRoleDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser | null;
  roles: Role[];
  onSubmit: (values: AssignRoleFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function AssignRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSubmit,
  isSubmitting = false,
}: AssignRoleDialogProps) {
  const { user: actor } = useAuth();
  const actorRoles = actor?.roles ?? [];

  const actorRoleNames = actorRoles.map((role) => role.name);

  const assignableRoles = React.useMemo(
    () =>
      getAssignableRoleNames(
        actorRoleNames,
        roles.map((role) => role.name),
      ),
    [actorRoleNames, roles],
  );

  const currentRole = user ? getUserRoleNames(user)[0] ?? '' : '';

  const form = useForm<AssignRoleFormValues>({
    resolver: zodResolver(assignRoleFormSchema),
    defaultValues: { role: '' },
  });

  const assignableRolesKey = assignableRoles.join('|');

  React.useEffect(() => {
    if (!open || !user) return;

    const roleNames = assignableRolesKey
      ? assignableRolesKey.split('|')
      : [];
    const defaultRole = roleNames.includes(currentRole)
      ? currentRole
      : roleNames[0] ?? '';

    form.reset({ role: defaultRole });
  }, [open, user?.id, currentRole, assignableRolesKey, user, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign role</DialogTitle>
          <DialogDescription>
            Choose a role for{' '}
            <span className="font-medium text-foreground">{user?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <div className="rounded-lg border bg-muted/30 px-4 py-3">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Current:</span>
              <RoleBadges roles={getUserRoleNames(user)} />
            </div>
          </div>
        ) : null}

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={isSubmitting || assignableRoles.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignableRoles.map((roleName) => (
                        <SelectItem key={roleName} value={roleName}>
                          {roleName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || assignableRoles.length === 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign role'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
