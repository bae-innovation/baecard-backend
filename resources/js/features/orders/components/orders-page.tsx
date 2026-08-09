import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Pencil, Plus, ShoppingCart, Trash2 } from 'lucide-react';
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
import { DeleteOrderDialog } from '@/features/orders/components/delete-order-dialog';
import { OrderDetailDialog } from '@/features/orders/components/order-detail-dialog';
import type { Order } from '@/features/orders/schemas/order.schema';
import {
  formatOrderDate,
  formatOrderMoney,
  formatOrderStatus,
} from '@/features/orders/utils/order-display.utils';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Order>();

function TruncatedCell({
  value,
  maxWidth = 'max-w-[200px]',
}: {
  value: string | null | undefined;
  maxWidth?: string;
}) {
  if (!value) return <span className="text-muted-foreground">—</span>;
  return (
    <p className={`truncate text-sm ${maxWidth}`} title={value}>
      {value}
    </p>
  );
}

function StatusBadge({ status }: { status: string }) {
  return <Badge variant="outline">{formatOrderStatus(status)}</Badge>;
}

type OrdersPageProps = {
  orders: LaravelPaginator<Order>;
  variant: 'website' | 'custom';
};

export function OrdersPage({ orders, variant }: OrdersPageProps) {
  const {
    canViewWebsiteOrders,
    canUpdateWebsiteOrders,
    canViewCustomOrders,
    canCreateCustomOrders,
    canUpdateCustomOrders,
    canDeleteCustomOrders,
  } = useAuth();

  const isWebsite = variant === 'website';
  const pathPrefix = isWebsite ? '/orders' : '/custom-orders';
  const canView = isWebsite ? canViewWebsiteOrders() : canViewCustomOrders();
  const canCreate = !isWebsite && canCreateCustomOrders();
  const canUpdate = isWebsite ? canUpdateWebsiteOrders() : canUpdateCustomOrders();
  const canDelete = !isWebsite && canDeleteCustomOrders();
  const showActionsColumn = canView || canUpdate || canDelete;
  const pageTitle = isWebsite ? 'Website Orders' : 'Custom Orders';
  const pageDescription = isWebsite
    ? 'Orders placed through the public website'
    : 'Manually created customer orders';
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(orders, ['orders']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Order | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  const openView = React.useCallback((order: Order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  }, []);

  const openDelete = React.useCallback((order: Order) => {
    setSelectedForDelete(order);
    setDeleteOpen(true);
  }, []);

  React.useEffect(() => {
    if (!selectedOrder) return;
    const updated = data.find((order) => order.id === selectedOrder.id);
    if (updated) setSelectedOrder(updated);
  }, [data, selectedOrder?.id]);

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDelete ? [createDataTableSelectionColumn<Order>()] : []),
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm tabular-nums">{getValue()}</span>
        ),
      }),
      columnHelper.accessor('order_number', {
        header: 'Order #',
        cell: ({ row }) =>
          canView ? (
            <button
              type="button"
              className="font-mono text-sm font-medium hover:opacity-80"
              onClick={() => openView(row.original)}
            >
              {row.original.order_number}
            </button>
          ) : (
            <span className="font-mono text-sm font-medium">{row.original.order_number}</span>
          ),
      }),
      columnHelper.accessor('product_name', {
        header: 'Product',
        cell: ({ row }) =>
          canView ? (
            <button
              type="button"
              className="min-w-[140px] text-left hover:opacity-80"
              onClick={() => openView(row.original)}
            >
              <p className="font-medium">{row.original.product_name}</p>
            </button>
          ) : (
            <p className="min-w-[140px] font-medium">{row.original.product_name}</p>
          ),
      }),
      columnHelper.accessor('customer_id', {
        header: 'Customer ID',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm tabular-nums">#{getValue()}</span>
        ),
      }),
      columnHelper.display({
        id: 'customer_name',
        header: 'Customer',
        cell: ({ row }) => row.original.customer?.name ?? `#${row.original.customer_id}`,
      }),
      columnHelper.display({
        id: 'customer_email',
        header: 'Customer Email',
        cell: ({ row }) => row.original.customer?.email ?? '—',
      }),
      columnHelper.accessor('product_id', {
        header: 'Product ID',
        cell: ({ getValue }) => {
          const id = getValue();
          if (id == null) return '—';
          return <span className="font-mono text-sm tabular-nums">#{id}</span>;
        },
      }),
      columnHelper.accessor('unit_price', {
        header: 'Unit Price',
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('quantity', {
        header: 'Qty',
        cell: ({ getValue }) => <span className="tabular-nums">{getValue()}</span>,
      }),
      columnHelper.accessor('subtotal', {
        header: 'Subtotal',
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('discount_type', {
        header: 'Discount Type',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('discount_code', {
        header: 'Discount Code',
        cell: ({ getValue }) => (
          <span className="font-mono text-sm">{getValue() ?? '—'}</span>
        ),
      }),
      columnHelper.accessor('tax', {
        header: 'Tax',
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('shipping_cost', {
        header: 'Shipping',
        cell: ({ getValue }) => (
          <span className="tabular-nums">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('total', {
        header: 'Total',
        cell: ({ getValue }) => (
          <span className="font-medium tabular-nums">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('paid_amount', {
        header: 'Paid',
        cell: ({ getValue }) => (
          <span className="tabular-nums text-sm">{formatOrderMoney(getValue())}</span>
        ),
      }),
      columnHelper.accessor('due_amount', {
        header: 'Due',
        cell: ({ getValue }) => {
          const due = getValue();
          if (due == null || due === 0) return '—';
          return (
            <span className="font-medium tabular-nums text-amber-600 dark:text-amber-400">
              {formatOrderMoney(due)}
            </span>
          );
        },
      }),
      columnHelper.accessor('payment_status', {
        header: 'Payment',
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      }),
      columnHelper.accessor('notes', {
        header: 'Notes',
        cell: ({ getValue }) => <TruncatedCell value={getValue()} maxWidth="max-w-[240px]" />,
      }),
      columnHelper.accessor('created_at', {
        header: 'Created',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatOrderDate(getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('updated_at', {
        header: 'Updated',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm text-muted-foreground">
            {formatOrderDate(getValue())}
          </span>
        ),
      }),
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Order>({
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

          if (canUpdate && !isWebsite) {
            menuItems.push(
              <TableDropdownAction
                key="edit"
                icon={Pencil}
                onClick={() => router.visit(`${pathPrefix}/${row.original.id}/edit`)}
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
            <DataTableRowActionsMenu label={`Actions for ${row.original.order_number}`}>
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
    isWebsite,
    openDelete,
    openView,
    pathPrefix,
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
        customer_id: false,
        customer_email: false,
        product_id: false,
        subtotal: false,
        discount_type: false,
        discount_code: false,
        tax: false,
        shipping_cost: false,
        notes: false,
        created_at: false,
        updated_at: false,
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle title={pageTitle} description={pageDescription} icon={ShoppingCart} />
        {canCreate ? (
          <Button type="button" onClick={() => router.visit(`${pathPrefix}/create`)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{
          emptyMessage: canCreate
            ? 'No custom orders found. Create the first order to get started.'
            : isWebsite
              ? 'No website orders found.'
              : 'No custom orders found.',
        }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search orders..."
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
                    order_number: 'Order #',
                    product_name: 'Product',
                    customer_id: 'Customer ID',
                    customer_name: 'Customer',
                    customer_email: 'Customer Email',
                    product_id: 'Product ID',
                    unit_price: 'Unit Price',
                    quantity: 'Qty',
                    subtotal: 'Subtotal',
                    discount_type: 'Discount Type',
                    discount_code: 'Discount Code',
                    tax: 'Tax',
                    shipping_cost: 'Shipping',
                    total: 'Total',
                    paid_amount: 'Paid',
                    due_amount: 'Due',
                    payment_status: 'Payment',
                    status: 'Status',
                    notes: 'Notes',
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
        <OrderDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          order={selectedOrder}
          canUpdate={canUpdate}
          canDelete={canDelete}
          allowFullEdit={!isWebsite}
          pathPrefix={pathPrefix}
          onDelete={canDelete ? openDelete : undefined}
          onRefresh={reload}
        />
      ) : null}
      {canDelete ? (
        <DeleteOrderDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          order={selectedForDelete}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!selectedForDelete) return;
            setIsDeleting(true);
            router.delete(`${pathPrefix}/${selectedForDelete.id}`, {
              onSuccess: () => {
                showMutationSuccess('Order deleted');
                setDeleteOpen(false);
                setSelectedForDelete(null);
              },
              onError: () => showMutationError(null, 'Failed to delete order'),
              onFinish: () => setIsDeleting(false),
            });
          }}
        />
      ) : null}
    </div>
  );
}
