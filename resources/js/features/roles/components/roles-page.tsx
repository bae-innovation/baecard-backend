import { router } from '@inertiajs/react';
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
import { RoleFormDialog } from '@/features/roles/components/role-form-dialog';
import type { Role } from '@/features/roles/schemas/role.schema';
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
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(roles, ['roles']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openCreate = React.useCallback(() => {
    setFormMode('create');
    setSelectedRole(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((role: Role) => {
    setFormMode('edit');
    setSelectedRole(role);
    setFormOpen(true);
  }, []);

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
            {row.original.name === 'SuperAdmin' ? (
              <Badge variant="secondary" className="text-xs">
                Protected
              </Badge>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor('guard_name', {
        header: 'Guard',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue() ?? 'sanctum'}</span>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue())}</span>
        ),
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{formatDate(getValue())}</span>
        ),
      }),
      createDataTableActionsColumn<Role>({
        cell: ({ row }) => {
          const role = row.original;
          const isProtected = role.name === 'SuperAdmin';

          return (
            <DataTableRowActionsMenu label={`Actions for ${role.name}`}>
              <TableDropdownAction icon={Pencil} onClick={() => openEdit(role)}>
                Edit
              </TableDropdownAction>
              <TableDropdownAction
                icon={Trash2}
                className="text-destructive focus:text-destructive"
                disabled={isProtected}
                onClick={() => openDelete(role)}
              >
                Delete
              </TableDropdownAction>
            </DataTableRowActionsMenu>
          );
        },
      }),
    ],
    [openDelete, openEdit],
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
          description="Manage platform roles and define who can access each area."
        />
        <Button type="button" className="shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Create role
        </Button>
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
          <DataTableFooter
            table={table}
            totalRecords={roles.total}
            compactLayout
          />
        }
      />

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        role={selectedRole}
        isSubmitting={isSubmitting}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          if (formMode === 'create') {
            router.post('/access-control/roles', values, {
              preserveScroll: true,
              only: ['roles'],
              onSuccess: () => {
                showMutationSuccess('Role created successfully');
                setFormOpen(false);
              },
              onError: () => showMutationError(null, 'Failed to create role'),
              onFinish: () => setIsSubmitting(false),
            });
            return;
          }
          if (!selectedRole) {
            setIsSubmitting(false);
            return;
          }
          router.put(`/access-control/roles/${selectedRole.id}`, values, {
            preserveScroll: true,
            only: ['roles'],
            onSuccess: () => {
              showMutationSuccess('Role updated successfully');
              setFormOpen(false);
              setSelectedRole(null);
            },
            onError: () => showMutationError(null, 'Failed to update role'),
            onFinish: () => setIsSubmitting(false),
          });
        }}
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
