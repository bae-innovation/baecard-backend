import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Pencil,
  Plus,
  Shield,
  Trash2,
  UserCog,
  UserRoundCog,
} from 'lucide-react';
import * as React from 'react';

import {
  DataTableFooter,
  DataTableLayout,
  DataTableToolbar,
  DataTableViewOptions,
  createDataTableActionsColumn,
  createDataTableSelectionColumn,
  DataTableRowActionsMenu,
} from '@/components/shared/data-table';
import { PageTitle } from '@/components/shared/page-title';
import { RoleBadges } from '@/components/shared/role-badges';
import { TableDropdownAction } from '@/components/shared/table-dropdown-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssignRoleDialog } from '@/features/users/components/assign-role-dialog';
import { AccessControlUserFormDialog } from '@/features/users/components/access-control-user-form-dialog';
import { DeleteUserDialog } from '@/features/users/components/delete-user-dialog';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import type { Role } from '@/features/roles/schemas/role.schema';
import type { AdminUser } from '@/features/users/schemas/user.schema';
import { getUserRoleNames } from '@/features/users/schemas/user.schema';
import type {
  AssignRoleFormValues,
  CreateStaffUserFormValues,
} from '@/features/users/schemas/user.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { canAssignRoles } from '@/lib/role-assignment';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<AdminUser>();

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(value),
  );
}

type AccessControlUsersPageProps = {
  users: LaravelPaginator<AdminUser>;
  roles: Role[];
};

export function AccessControlUsersPage({ users, roles }: AccessControlUsersPageProps) {
  const { user, hasAbility } = useAuth();
  const actorRoles = user?.roles ?? [];
  const actorRoleNames = actorRoles.map((role) => role.name);
  const canCreate = hasAbility('users.create');
  const canUpdate = hasAbility('users.update');
  const canDelete = hasAbility('users.delete');
  const canAssign =
    hasAbility('users.assign_role') && canAssignRoles(actorRoleNames);
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(users, ['users']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openAssign = React.useCallback((target: AdminUser) => {
    setSelectedUser(target);
    setAssignOpen(true);
  }, []);

  const openEdit = React.useCallback((target: AdminUser) => {
    setSelectedUser(target);
    setEditOpen(true);
  }, []);

  const openDelete = React.useCallback((target: AdminUser) => {
    setSelectedUser(target);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<AdminUser>(),
      columnHelper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.display({
        id: 'roles',
        header: 'Role',
        cell: ({ row }) => (
          <RoleBadges roles={getUserRoleNames(row.original)} />
        ),
      }),
      columnHelper.accessor('email_verified_at', {
        header: 'Verified',
        cell: ({ getValue }) =>
          getValue() ? (
            <Badge variant="secondary" className="font-normal">
              Verified
            </Badge>
          ) : (
            <Badge variant="outline" className="font-normal">
              Pending
            </Badge>
          ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Joined',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue())}</span>
        ),
      }),
      createDataTableActionsColumn<AdminUser>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
            {canAssign ? (
              <TableDropdownAction
                icon={UserRoundCog}
                onClick={() => openAssign(row.original)}
              >
                Assign role
              </TableDropdownAction>
            ) : null}
            {canUpdate ? (
              <TableDropdownAction
                icon={Pencil}
                onClick={() => openEdit(row.original)}
              >
                Edit
              </TableDropdownAction>
            ) : null}
            {canDelete ? (
              <TableDropdownAction
                icon={Trash2}
                className="text-destructive focus:text-destructive"
                onClick={() => openDelete(row.original)}
              >
                Delete
              </TableDropdownAction>
            ) : null}
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [canAssign, canDelete, canUpdate, openAssign, openDelete, openEdit],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, globalFilter, rowSelection },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Access Control · Users"
          icon={UserCog}
          color="indigo"
          description="Manage team accounts, roles, and access. Customer accounts are listed under Customers."
        />
        {canCreate ? (
          <Button
            type="button"
            className="shrink-0"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="size-4" />
            Create user
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-gradient-to-br from-indigo-50/80 to-background p-4 dark:from-indigo-950/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            Total team users
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {users.total?.toLocaleString() ?? '—'}
          </p>
        </div>
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{ emptyMessage: 'No team users found.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search team users..."
                className="h-9 w-full max-w-xs"
                aria-label="Search team users"
              />
            }
            end={
              <div className="flex items-center gap-2">
                {isFetching ? (
                  <span className="text-xs text-muted-foreground">Updating...</span>
                ) : null}
                <DataTableViewOptions
                  table={table}
                  showExport={false}
                  onRefresh={reload}
                  isRefreshing={isFetching}
                />
              </div>
            }
          />
        }
        footer={
          <DataTableFooter
            table={table}
            totalRecords={users.total}
            compactLayout
          />
        }
      />

      <AssignRoleDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        user={selectedUser}
        roles={roles}
        isSubmitting={isSubmitting}
        onSubmit={async (values: AssignRoleFormValues) => {
          if (!selectedUser) return;
          setIsSubmitting(true);
          router.patch(
            `/access-control/users/${selectedUser.id}/assign-role`,
            values,
            {
              preserveScroll: true,
              only: ['users'],
              onSuccess: () => {
                showMutationSuccess('Role assigned successfully');
                setAssignOpen(false);
                setSelectedUser(null);
              },
              onError: () => showMutationError(null, 'Failed to assign role'),
              onFinish: () => setIsSubmitting(false),
            },
          );
        }}
      />

      <AccessControlUserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        roles={roles}
        isSubmitting={isCreating}
        onSubmit={async (values: CreateStaffUserFormValues) => {
          setIsCreating(true);
          router.post('/access-control/users', values, {
            preserveScroll: true,
            only: ['users'],
            onSuccess: () => {
              showMutationSuccess('User created successfully');
              setCreateOpen(false);
            },
            onError: () => showMutationError(null, 'Failed to create user'),
            onFinish: () => setIsCreating(false),
          });
        }}
      />

      <UserFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        mode="edit"
        user={selectedUser}
        isSubmitting={isSubmitting}
        onSubmit={async (values) => {
          if (!selectedUser) return;
          setIsSubmitting(true);
          router.put(
            `/access-control/users/${selectedUser.id}`,
            {
              name: values.name,
              email: values.email,
              phone: values.phone,
            },
            {
              preserveScroll: true,
              only: ['users'],
              onSuccess: () => {
                showMutationSuccess('User updated successfully');
                setEditOpen(false);
                setSelectedUser(null);
              },
              onError: () => showMutationError(null, 'Failed to update user'),
              onFinish: () => setIsSubmitting(false),
            },
          );
        }}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        user={selectedUser}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedUser) return;
          setIsDeleting(true);
          router.delete(`/access-control/users/${selectedUser.id}`, {
            preserveScroll: true,
            only: ['users'],
            onSuccess: () => {
              showMutationSuccess('User deleted successfully');
              setDeleteOpen(false);
              setSelectedUser(null);
            },
            onError: () => showMutationError(null, 'Failed to delete user'),
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </div>
  );
}
