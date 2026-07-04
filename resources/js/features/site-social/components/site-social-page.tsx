import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Pencil, Pin, Plus, Power, Share2, Trash2 } from 'lucide-react';
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
import { DeleteSiteSocialDialog } from '@/features/site-social/components/delete-site-social-dialog';
import {
  PLATFORM_LABELS,
  type SiteSocialLink,
} from '@/features/site-social/schemas/site-social.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<SiteSocialLink>();

type SiteSocialPageProps = {
  siteSocialLinks: LaravelPaginator<SiteSocialLink>;
};

export function SiteSocialPage({ siteSocialLinks }: SiteSocialPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('site_social.manage');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(siteSocialLinks, ['siteSocialLinks']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<SiteSocialLink | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDelete = React.useCallback((link: SiteSocialLink) => {
    setSelectedForDelete(link);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<SiteSocialLink>(),
      columnHelper.accessor('platform', {
        header: 'Platform',
        cell: ({ getValue }) => (
          <Badge variant="outline">{PLATFORM_LABELS[getValue()]}</Badge>
        ),
      }),
      columnHelper.accessor('platform_value', {
        header: 'Value',
        cell: ({ row }) => (
          <div className="min-w-[180px] max-w-xs">
            <p className="truncate font-medium">{row.original.platform_value}</p>
            {row.original.label ? (
              <p className="truncate text-sm text-muted-foreground">{row.original.label}</p>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor('show_in_floating', {
        header: 'Floating',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Visible' : 'Hidden'}
          </Badge>
        ),
      }),
      columnHelper.accessor('sort_order', {
        header: 'Order',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      createDataTableActionsColumn<SiteSocialLink>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.platform}`}>
            {canManage ? (
              <>
                <TableDropdownAction
                  icon={Pencil}
                  onClick={() => router.visit(`/admin/site-social/${row.original.id}/edit`)}
                >
                  Edit
                </TableDropdownAction>
                <TableDropdownAction
                  icon={Pin}
                  onClick={() => {
                    router.patch(`/admin/site-social/${row.original.id}/toggle-floating`, {}, {
                      preserveScroll: true,
                      only: ['siteSocialLinks'],
                      onSuccess: () => showMutationSuccess('Floating visibility updated'),
                      onError: () => showMutationError(null, 'Failed to update floating visibility'),
                    });
                  }}
                >
                  {row.original.show_in_floating ? 'Hide from floating dock' : 'Show in floating dock'}
                </TableDropdownAction>
                <TableDropdownAction
                  icon={Power}
                  onClick={() => {
                    router.patch(`/admin/site-social/${row.original.id}/toggle-active`, {}, {
                      preserveScroll: true,
                      only: ['siteSocialLinks'],
                      onSuccess: () => showMutationSuccess('Social link status updated'),
                      onError: () => showMutationError(null, 'Failed to update status'),
                    });
                  }}
                >
                  {row.original.is_active ? 'Deactivate' : 'Activate'}
                </TableDropdownAction>
                <TableDropdownAction
                  icon={Trash2}
                  className="text-destructive focus:text-destructive"
                  onClick={() => openDelete(row.original)}
                >
                  Delete
                </TableDropdownAction>
              </>
            ) : null}
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [canManage, openDelete],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { globalFilter, rowSelection, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          title="Social Management"
          description="Manage website social links and floating contact icons"
          icon={Share2}
        />
        {canManage ? (
          <Button onClick={() => router.visit('/admin/site-social/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Social Link
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        toolbar={
          <DataTableToolbar>
            <Input
              placeholder="Search social links..."
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="max-w-sm"
            />
            <DataTableViewOptions table={table} />
          </DataTableToolbar>
        }
        footer={<DataTableFooter table={table} isFetching={isFetching} />}
        table={table}
      />

      <DeleteSiteSocialDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        siteSocialLink={selectedForDelete}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedForDelete) return;
          setIsDeleting(true);
          router.delete(`/admin/site-social/${selectedForDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
              showMutationSuccess('Social link deleted');
              setDeleteOpen(false);
              setSelectedForDelete(null);
              reload();
            },
            onError: () => showMutationError(null, 'Failed to delete social link'),
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </div>
  );
}
