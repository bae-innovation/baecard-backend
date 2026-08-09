import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Pencil, Plus, Trash2, UserRound } from 'lucide-react';
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
import { CustomerDetailDialog } from '@/features/customers/components/customer-detail-dialog';
import { CustomerFormDialog } from '@/features/customers/components/customer-form-dialog';
import { DeleteCustomerDialog } from '@/features/customers/components/customer-delete-dialog';
import type {
  CreateCustomerFormValues,
  Customer,
} from '@/features/customers/schemas/customer.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Customer>();

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(value),
  );
}

type CustomersPageProps = {
  customers: LaravelPaginator<Customer>;
};

export function CustomersPage({ customers }: CustomersPageProps) {
  const {
    canViewCustomers,
    canCreateCustomers,
    canUpdateCustomers,
    canDeleteCustomers,
  } = useAuth();
  const canView = canViewCustomers();
  const canCreate = canCreateCustomers();
  const canUpdate = canUpdateCustomers();
  const canDelete = canDeleteCustomers();
  const showActionsColumn = canView || canUpdate || canDelete;

  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(customers, ['customers']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [detailCustomer, setDetailCustomer] = React.useState<Customer | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openCreate = React.useCallback(() => {
    setFormMode('create');
    setSelectedCustomer(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((customer: Customer) => {
    setFormMode('edit');
    setSelectedCustomer(customer);
    setFormOpen(true);
  }, []);

  const openDelete = React.useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteOpen(true);
  }, []);

  const openDetails = React.useCallback((customer: Customer) => {
    setDetailCustomer(customer);
    setDetailOpen(true);
  }, []);

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDelete ? [createDataTableSelectionColumn<Customer>()] : []),
      columnHelper.accessor('name', {
        header: 'Customer',
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
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Customer>({
        cell: ({ row }) => {
          const menuItems: React.ReactNode[] = [];

          if (canView) {
            menuItems.push(
              <TableDropdownAction
                key="view"
                icon={Eye}
                onClick={() => openDetails(row.original)}
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
                onClick={() => openEdit(row.original)}
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
          title="Customers"
          icon={UserRound}
          description="Manage customer accounts and orders."
        />
        {canCreate ? (
          <Button type="button" className="shrink-0" onClick={openCreate}>
            <Plus className="size-4" />
            Create customer
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{
          emptyMessage: canCreate
            ? 'No customers yet. Create the first customer to get started.'
            : 'No customers found.',
        }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder="Search customers..."
                className="h-9 w-full max-w-xs"
                aria-label="Search customers"
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
            totalRecords={customers.total}
            compactLayout
          />
        }
      />

      {canCreate || canUpdate ? (
        <CustomerFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          customer={selectedCustomer}
          isSubmitting={isSubmitting}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            if (formMode === 'create') {
              router.post('/customers', values as CreateCustomerFormValues, {
                preserveScroll: true,
                only: ['customers'],
                onSuccess: () => {
                  showMutationSuccess('Customer created successfully');
                  setFormOpen(false);
                },
                onError: () => showMutationError(null, 'Failed to create customer'),
                onFinish: () => setIsSubmitting(false),
              });
              return;
            }
            if (!selectedCustomer) {
              setIsSubmitting(false);
              return;
            }
            router.put(
              `/customers/${selectedCustomer.id}`,
              {
                name: values.name,
                email: values.email,
                phone: values.phone,
              },
              {
                preserveScroll: true,
                only: ['customers'],
                onSuccess: () => {
                  showMutationSuccess('Customer updated successfully');
                  setFormOpen(false);
                  setSelectedCustomer(null);
                },
                onError: () => showMutationError(null, 'Failed to update customer'),
                onFinish: () => setIsSubmitting(false),
              },
            );
          }}
        />
      ) : null}

      {canDelete ? (
        <DeleteCustomerDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          customer={selectedCustomer}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!selectedCustomer) return;
            setIsDeleting(true);
            router.delete(`/customers/${selectedCustomer.id}`, {
              preserveScroll: true,
              only: ['customers'],
              onSuccess: () => {
                showMutationSuccess('Customer deleted successfully');
                setDeleteOpen(false);
                setSelectedCustomer(null);
              },
              onError: () => showMutationError(null, 'Failed to delete customer'),
              onFinish: () => setIsDeleting(false),
            });
          }}
        />
      ) : null}

      {canView ? (
        <CustomerDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          customer={detailCustomer}
        />
      ) : null}
    </div>
  );
}
