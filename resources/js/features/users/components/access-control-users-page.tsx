import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Shield, UserCog, UserRoundCog } from 'lucide-react';
import * as React from 'react';

import {
  DataTableFooter,
  DataTableLayout,
  DataTableToolbar,
  DataTableViewOptions,
  createDataTableActionsColumn,
  createDataTableSelectionColumn,
} from '@/components/shared/data-table';
import { PageTitle } from '@/components/shared/page-title';
import { RoleBadges } from '@/components/shared/role-badges';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssignRoleDialog } from '@/features/users/components/assign-role-dialog';
import type { Role } from '@/features/roles/schemas/role.schema';
import type { AdminUser } from '@/features/users/schemas/user.schema';
import { getUserRoleNames } from '@/features/users/schemas/user.schema';
import type { AssignRoleFormValues } from '@/features/users/schemas/user.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { canAssignRoles } from '@/lib/role-assignment';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<AdminUser>();

type AccessControlUsersPageProps = {
  users: LaravelPaginator<AdminUser>;
  roles: Role[];
};

export function AccessControlUsersPage({ users, roles }: AccessControlUsersPageProps) {
  const { user } = useAuth();
  const actorRoles = user?.roles ?? [];
  const actorRoleNames = actorRoles.map((role) => role.name);
  const canAssign = canAssignRoles(actorRoleNames);
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(users, ['users']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openAssign = React.useCallback((target: AdminUser) => {
    setSelectedUser(target);
    setAssignOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<AdminUser>(),
      columnHelper.accessor('name', {
        header: 'User',
        cell: ({ getValue }) => (
          <span className="font-medium text-foreground">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ getValue }) => (
          <span className="truncate text-muted-foreground">{getValue() ?? '—'}</span>
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
      createDataTableActionsColumn<AdminUser>({
        meta: { actionsLayout: 'wide' },
        cell: ({ row }) =>
          canAssign ? (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => openAssign(row.original)}
            >
              <UserRoundCog className="size-4" />
              Assign role
            </Button>
          ) : null,
      }),
    ],
    [canAssign, openAssign],
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
      <PageTitle
        title="Access Control · Users"
        icon={UserCog}
        color="indigo"
        description="Review every account and assign the right role for secure access."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-gradient-to-br from-indigo-50/80 to-background p-4 dark:from-indigo-950/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="size-4 text-indigo-600 dark:text-indigo-400" />
            Total users
          </div>
          <p className="mt-2 text-2xl font-semibold tabular-nums">
            {users.total?.toLocaleString() ?? '—'}
          </p>
        </div>
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{ emptyMessage: 'No users found.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search users..."
                className="h-9 w-full max-w-xs"
                aria-label="Search users"
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
          router.patch(`/access-control/users/${selectedUser.id}/role`, values, {
            preserveScroll: true,
            only: ['users'],
            onSuccess: () => {
              showMutationSuccess('Role assigned successfully');
              setAssignOpen(false);
              setSelectedUser(null);
            },
            onError: () => showMutationError(null, 'Failed to assign role'),
            onFinish: () => setIsSubmitting(false),
          });
        }}
      />
    </div>
  );
}
