import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Link2, Pencil, Plus, Trash2, Users } from 'lucide-react';
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
import { CustomerSocialsDialog } from '@/features/customer-socials/components/customer-socials-dialog';
import { DeleteUserDialog } from '@/features/users/components/delete-user-dialog';
import { UserFormDialog } from '@/features/users/components/user-form-dialog';
import type {
  AdminUser,
  CreateUserFormValues,
} from '@/features/users/schemas/user.schema';
import { getUserRoleNames } from '@/features/users/schemas/user.schema';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<AdminUser>();

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(value),
  );
}

type UsersManagementPageProps = {
  users: LaravelPaginator<AdminUser>;
  variant?: 'users' | 'customers';
};

export function UsersManagementPage({
  users,
  variant = 'users',
}: UsersManagementPageProps) {
  const paginationKey = variant === 'customers' ? 'customers' : 'users';
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(users, [paginationKey]);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [socialsOpen, setSocialsOpen] = React.useState(false);
  const [socialsUser, setSocialsUser] = React.useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openCreate = React.useCallback(() => {
    setFormMode('create');
    setSelectedUser(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((user: AdminUser) => {
    setFormMode('edit');
    setSelectedUser(user);
    setFormOpen(true);
  }, []);

  const openDelete = React.useCallback((user: AdminUser) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  }, []);

  const openSocials = React.useCallback((user: AdminUser) => {
    setSocialsUser(user);
    setSocialsOpen(true);
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
            <TableDropdownAction
              icon={Link2}
              onClick={() => openSocials(row.original)}
            >
              Social Links
            </TableDropdownAction>
            <TableDropdownAction
              icon={Pencil}
              onClick={() => openEdit(row.original)}
            >
              Edit
            </TableDropdownAction>
            <TableDropdownAction
              icon={Trash2}
              className="text-destructive focus:text-destructive"
              onClick={() => openDelete(row.original)}
            >
              Delete
            </TableDropdownAction>
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [openDelete, openEdit, openSocials],
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

  const isCustomers = variant === 'customers';
  const pageTitle = isCustomers ? 'Customers' : 'Users';
  const pageDescription = isCustomers
    ? 'Manage customer accounts and their social links.'
    : 'Create and manage team accounts from one central directory.';
  const createLabel = isCustomers ? 'Create customer' : 'Create user';
  const emptyMessage = isCustomers
    ? 'No customers yet. Create the first customer to get started.'
    : 'No users yet. Create the first account to get started.';
  const searchPlaceholder = isCustomers ? 'Search customers...' : 'Search users...';
  const searchAriaLabel = isCustomers ? 'Search customers' : 'Search users';

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title={pageTitle}
          icon={Users}
          color="blue"
          description={pageDescription}
        />
        <Button type="button" className="shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          {createLabel}
        </Button>
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{ emptyMessage }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full max-w-xs"
                aria-label={searchAriaLabel}
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

      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        user={selectedUser}
        isSubmitting={isSubmitting}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          if (formMode === 'create') {
            router.post('/users', values as CreateUserFormValues, {
              preserveScroll: true,
              only: ['users'],
              onSuccess: () => {
                showMutationSuccess('User created successfully');
                setFormOpen(false);
              },
              onError: () => showMutationError(null, 'Failed to create user'),
              onFinish: () => setIsSubmitting(false),
            });
            return;
          }
          if (!selectedUser) {
            setIsSubmitting(false);
            return;
          }
          router.put(
            `/users/${selectedUser.id}`,
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
                setFormOpen(false);
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
          router.delete(`/users/${selectedUser.id}`, {
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

      <CustomerSocialsDialog
        open={socialsOpen}
        onOpenChange={setSocialsOpen}
        customerId={socialsUser?.id ?? 0}
        customerName={socialsUser?.name}
      />
    </div>
  );
}
