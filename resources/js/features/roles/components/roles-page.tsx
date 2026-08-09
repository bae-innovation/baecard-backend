import { Link, router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
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
import { TableDropdownAction } from '@/components/shared/table-dropdown-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteRoleDialog } from '@/features/roles/components/delete-role-dialog';
import type { Role } from '@/features/roles/schemas/role.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Role>();
const PROTECTED_ROLES = new Set(['SuperAdmin', 'User']);

function formatDate(value?: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

type RolesPageProps = {
  roles: LaravelPaginator<Role>;
};

export function RolesPage({ roles }: RolesPageProps) {
  const { hasPermission } = useAuth();
  const canCreate = hasPermission('rbac.role.create');
  const canUpdate = hasPermission('rbac.role.update');
  const canDelete = hasPermission('rbac.role.delete');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(roles, ['roles']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDelete = React.useCallback((role: Role) => {
    setSelectedRole(role);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<Role>(),
      columnHelper.accessor('name', {
        header: 'Role',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{getValue()}</span>
            {PROTECTED_ROLES.has(row.original.name) ? (
              <Badge variant="secondary" className="text-xs">
                Protected
              </Badge>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor('permissions_count', {
        header: 'Permissions',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue() ?? 0}</span>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue())}</span>
        ),
      }),
      createDataTableActionsColumn<Role>({
        cell: ({ row }) => {
          const role = row.original;
          const isProtected = PROTECTED_ROLES.has(role.name);

          return (
            <DataTableRowActionsMenu label={`Actions for ${role.name}`}>
              {canUpdate && !isProtected ? (
                <TableDropdownAction icon={Pencil} asChild>
                  <Link href={`/access-control/roles/${role.id}/edit`}>Edit</Link>
                </TableDropdownAction>
              ) : null}
              {canDelete && !isProtected ? (
                <TableDropdownAction
                  icon={Trash2}
                  className="text-destructive focus:text-destructive"
                  onClick={() => openDelete(role)}
                >
                  Delete
                </TableDropdownAction>
              ) : null}
            </DataTableRowActionsMenu>
          );
        },
      }),
    ],
    [canDelete, canUpdate, openDelete],
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
          title="Roles"
          icon={ShieldCheck}
          color="violet"
          description="Manage platform roles and assign permissions."
        />
        {canCreate ? (
          <Button type="button" className="shrink-0" asChild>
            <Link href="/access-control/roles/create">
              <Plus className="size-4" />
              Create role
            </Link>
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{ emptyMessage: 'No roles found. Create your first role to get started.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search roles..."
                className="h-9 w-full max-w-xs"
                aria-label="Search roles"
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
          <DataTableFooter table={table} totalRecords={roles.total} compactLayout />
        }
      />

      <DeleteRoleDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        role={selectedRole}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedRole) return;
          setIsDeleting(true);
          router.delete(`/access-control/roles/${selectedRole.id}`, {
            preserveScroll: true,
            only: ['roles'],
            onSuccess: () => {
              showMutationSuccess('Role deleted successfully');
              setDeleteOpen(false);
              setSelectedRole(null);
            },
            onError: () => showMutationError(null, 'Failed to delete role'),
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </div>
  );
}
