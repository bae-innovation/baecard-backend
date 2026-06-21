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
  createRoleFormSchema,
  type CreateRoleFormValues,
  type Role,
  updateRoleFormSchema,
  type UpdateRoleFormValues,
} from '@/features/roles/schemas/role.schema';

type RoleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  role?: Role | null;
  onSubmit: (values: CreateRoleFormValues | UpdateRoleFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

export function RoleFormDialog({
  open,
  onOpenChange,
  mode,
  role,
  onSubmit,
  isSubmitting = false,
}: RoleFormDialogProps) {
  const schema = mode === 'create' ? createRoleFormSchema : updateRoleFormSchema;

  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: mode === 'edit' && role ? role.name : '',
      });
    }
  }, [open, mode, role, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create role' : 'Edit role'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new role to manage access across the platform.'
              : 'Update the role name. Assigned users keep their permissions.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g. Marketing"
                      autoComplete="off"
                      disabled={isSubmitting}
                    />
                  </FormControl>
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
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
