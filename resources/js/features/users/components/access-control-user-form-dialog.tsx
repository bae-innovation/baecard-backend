import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Role } from '@/features/roles/schemas/role.schema';
import {
  createStaffUserFormSchema,
  type CreateStaffUserFormValues,
} from '@/features/users/schemas/user.schema';
import { useAuth } from '@/hooks/useAuth';
import { getAssignableRoleNames } from '@/lib/role-assignment';

type AccessControlUserFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roles: Role[];
  onSubmit: (values: CreateStaffUserFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function AccessControlUserFormDialog({
  open,
  onOpenChange,
  roles,
  onSubmit,
  isSubmitting = false,
}: AccessControlUserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <AccessControlUserFormDialogContent
          onOpenChange={onOpenChange}
          roles={roles}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      ) : null}
    </Dialog>
  );
}

function AccessControlUserFormDialogContent({
  onOpenChange,
  roles,
  onSubmit,
  isSubmitting = false,
}: AccessControlUserFormDialogProps) {
  const { user } = useAuth();
  const actorRoleNames = (user?.roles ?? []).map((role) => role.name);
  const assignableRoles = React.useMemo(
    () =>
      getAssignableRoleNames(
        actorRoleNames,
        roles.map((role) => role.name),
      ),
    [actorRoleNames, roles],
  );

  const form = useForm<CreateStaffUserFormValues>({
    resolver: zodResolver(createStaffUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      role: assignableRoles[0] ?? '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const assignableRolesKey = assignableRoles.join('|');

  React.useEffect(() => {
    form.reset({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      role: assignableRolesKey ? assignableRolesKey.split('|')[0] ?? '' : '',
    });
  }, [assignableRolesKey, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>Create team user</DialogTitle>
        <DialogDescription>
          Add a new team account and assign its access role.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="jane@company.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Minimum 8 characters"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="Repeat password"
                    autoComplete="new-password"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+1 555 000 0000"
                    autoComplete="tel"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                  Creating...
                </>
              ) : (
                'Create user'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
