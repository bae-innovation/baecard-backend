import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
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
import { RoleDetailDialog } from '@/features/roles/components/role-detail-dialog';
import type { Role } from '@/features/roles/schemas/role.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Role>();

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
  const {
    canViewRoles,
    canCreateRoles,
    canUpdateRoles,
    canDeleteRoles,
  } = useAuth();
  const canView = canViewRoles();
  const canCreate = canCreateRoles();
  const canUpdate = canUpdateRoles();
  const canDelete = canDeleteRoles();
  const showActionsColumn = canView || canUpdate || canDelete;

  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(roles, ['roles']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDetails = React.useCallback((role: Role) => {
    setSelectedRole(role);
    setDetailOpen(true);
  }, []);

  const openEdit = React.useCallback((role: Role) => {
    router.visit(`/access-control/roles/${role.id}/edit`);
  }, []);

  const openDelete = React.useCallback((role: Role) => {
    setSelectedRole(role);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDelete ? [createDataTableSelectionColumn<Role>()] : []),
      columnHelper.accessor('name', {
        header: 'Role',
        cell: ({ getValue, row }) => (
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{getValue()}</span>
            {row.original.is_protected ? (
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
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Role>({
        meta: { actionsLayout: 'wide' },
        cell: ({ row }) => {
          const role = row.original;
          const isProtected = Boolean(role.is_protected);
          const menuItems: React.ReactNode[] = [];

          if (canView) {
            menuItems.push(
              <TableDropdownAction
                key="view"
                icon={Eye}
                onClick={() => openDetails(role)}
              >
                View details
              </TableDropdownAction>,
            );
          }

          if (canUpdate) {
            menuItems.push(
              <TableDropdownAction
                key="edit"
                icon={Pencil}
                disabled={isProtected}
                onClick={() => openEdit(role)}
              >
                Edit
              </TableDropdownAction>,
            );
          }

          if (canDelete) {
            menuItems.push(
              <TableDropdownAction
                key="delete"
                icon={Trash2}
                className="text-destructive focus:text-destructive"
                disabled={isProtected}
                onClick={() => openDelete(role)}
              >
                Delete
              </TableDropdownAction>,
            );
          }

          if (menuItems.length === 0) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }

          return (
            <DataTableRowActionsMenu label={`Actions for ${role.name}`}>
              {menuItems}
            </DataTableRowActionsMenu>
          );
        },
      }),
    ];
  }, [
    canDelete,
    canUpdate,
    canView,
    openDelete,
    openDetails,
    openEdit,
    showActionsColumn,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { pagination, globalFilter, rowSelection },
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: canDelete,
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
          <Button
            type="button"
            className="shrink-0"
            onClick={() => router.visit('/access-control/roles/create')}
          >
            <Plus className="size-4" />
            Create role
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

      {canView ? (
        <RoleDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          role={selectedRole}
        />
      ) : null}

      {canDelete ? (
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
      ) : null}
    </div>
  );
}
