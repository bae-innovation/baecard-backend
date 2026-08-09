import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Pencil, Plus, Store, Trash2 } from 'lucide-react';
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
import { DeleteVendorDialog } from '@/features/vendors/components/delete-vendor-dialog';
import { VendorDetailDialog } from '@/features/vendors/components/vendor-detail-dialog';
import type { Vendor } from '@/features/vendors/schemas/vendor.schema';
import { formatVendorDate } from '@/features/vendors/utils/vendor-display.utils';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Vendor>();

function TruncatedCell({
  value,
  className,
  maxWidth = 'max-w-[200px]',
}: {
  value: string | null | undefined;
  className?: string;
  maxWidth?: string;
}) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <p className={`truncate text-sm ${maxWidth} ${className ?? ''}`} title={value}>
      {value}
    </p>
  );
}

type VendorsPageProps = {
  vendors: LaravelPaginator<Vendor>;
};

export function VendorsPage({ vendors }: VendorsPageProps) {
  const {
    canViewVendors,
    canCreateVendors,
    canUpdateVendors,
    canDeleteVendors,
  } = useAuth();
  const canView = canViewVendors();
  const canCreate = canCreateVendors();
  const canUpdate = canUpdateVendors();
  const canDelete = canDeleteVendors();
  const showActionsColumn = canView || canUpdate || canDelete;

  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(vendors, ['vendors']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Vendor | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);

  const openView = React.useCallback((vendor: Vendor) => {
    setSelectedVendor(vendor);
    setDetailOpen(true);
  }, []);

  const openDelete = React.useCallback((vendor: Vendor) => {
    setSelectedForDelete(vendor);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDelete ? [createDataTableSelectionColumn<Vendor>()] : []),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm tabular-nums">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Vendor',
        cell: ({ row }) => (
          canView ? (
            <button
              type="button"
              className="flex min-w-[200px] items-center gap-3 text-left hover:opacity-80"
              onClick={() => openView(row.original)}
            >
              {row.original.image_url ? (
                <img
                  src={row.original.image_url}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                  <Store className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{row.original.name}</p>
              </div>
            </button>
          ) : (
            <div className="flex min-w-[200px] items-center gap-3">
              {row.original.image_url ? (
                <img
                  src={row.original.image_url}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                  <Store className="h-4 w-4 text-muted-foreground" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{row.original.name}</p>
              </div>
            </div>
          )
        ),
      }),
      columnHelper.accessor('slug', {
        header: 'Slug',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[240px]" />,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('website', {
        header: 'Website',
        cell: ({ getValue }) => {
          const url = getValue();
          if (!url) return '—';
          const href = url.startsWith('http') ? url : `https://${url}`;
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-primary hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {url.replace(/^https?:\/\//, '')}
            </a>
          );
        },
      }),
      columnHelper.accessor('address', {
        header: 'Address',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} />,
      }),
      columnHelper.accessor('image', {
        header: 'Image Path',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[160px]" />,
      }),
      columnHelper.accessor('is_active', {
        header: 'Status',
        cell: ({ getValue }) => (
          <Badge variant={getValue() ? 'default' : 'secondary'}>
            {getValue() ? 'Active' : 'Inactive'}
          </Badge>
        ),
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatVendorDate(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatVendorDate(getValue())}
          </span>
        ),
      }),
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Vendor>({
        cell: ({ row }) => {
          const menuItems: React.ReactNode[] = [];

          if (canView) {
            menuItems.push(
              <TableDropdownAction
                key="view"
                icon={Eye}
                onClick={() => openView(row.original)}
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
                onClick={() => router.visit(`/vendors/${row.original.id}/edit`)}
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
                onClick={() => openDelete(row.original)}
              >
                Delete
              </TableDropdownAction>,
            );
          }

          if (menuItems.length === 0) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }

          return (
            <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
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
    openView,
    showActionsColumn,
  ]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { globalFilter, rowSelection, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: canDelete,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: {
        slug: false,
        description: false,
        image: false,
        created_at: false,
        updated_at: false,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle title="Vendors" description="Manage vendors" icon={Store} />
        {canCreate ? (
          <Button type="button" onClick={() => router.visit('/vendors/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Vendor
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{
          emptyMessage: canCreate
            ? 'No vendors found. Add the first vendor to get started.'
            : 'No vendors found.',
        }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search vendors..."
                className="h-9 w-full max-w-xs"
              />
            }
            end={
              <DataTableViewOptions
                table={table}
                showExport={false}
                onRefresh={reload}
                isRefreshing={isFetching}
                columnLabelFormatter={(columnId) => {
                  const labels: Record<string, string> = {
                    id: 'ID',
                    name: 'Vendor',
                    slug: 'Slug',
                    description: 'Description',
                    email: 'Email',
                    phone: 'Phone',
                    website: 'Website',
                    address: 'Address',
                    image: 'Image Path',
                    is_active: 'Status',
                    created_at: 'Created',
                    updated_at: 'Updated',
                  };
                  return labels[columnId] ?? columnId.replaceAll('_', ' ');
                }}
              />
            }
          />
        }
        footer={<DataTableFooter table={table} />}
      />
      {canView ? (
        <VendorDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          vendor={selectedVendor}
          canUpdate={canUpdate}
          canDelete={canDelete}
          onDelete={canDelete ? openDelete : undefined}
        />
      ) : null}
      {canDelete ? (
        <DeleteVendorDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          vendor={selectedForDelete}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!selectedForDelete) return;
            setIsDeleting(true);
            router.delete(`/vendors/${selectedForDelete.id}`, {
              onSuccess: () => {
                showMutationSuccess('Vendor deleted');
                setDeleteOpen(false);
                setSelectedForDelete(null);
              },
              onError: () => showMutationError(null, 'Failed to delete vendor'),
              onFinish: () => setIsDeleting(false),
            });
          }}
        />
      ) : null}
    </div>
  );
}
