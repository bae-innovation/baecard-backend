import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Megaphone, Pencil, Plus, Power, Trash2 } from 'lucide-react';
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
import { DeleteOfferTickerDialog } from '@/features/offer-tickers/components/delete-offer-ticker-dialog';
import {
  OFFER_TICKER_THEME_GRADIENTS,
  OFFER_TICKER_THEME_LABELS,
  type OfferTicker,
} from '@/features/offer-tickers/schemas/offer-ticker.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<OfferTicker>();

type OfferTickersPageProps = {
  offerTickers: LaravelPaginator<OfferTicker>;
};

export function OfferTickersPage({ offerTickers }: OfferTickersPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('offer_tickers.manage');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(offerTickers, ['offerTickers']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<OfferTicker | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openDelete = React.useCallback((offerTicker: OfferTicker) => {
    setSelectedForDelete(offerTicker);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<OfferTicker>(),
      columnHelper.accessor('message.en', {
        header: 'Message',
        cell: ({ row }) => (
          <div className="min-w-[220px] max-w-sm">
            <p className="truncate font-medium">{row.original.message.en}</p>
            <p className="truncate text-sm text-muted-foreground">{row.original.message.bn}</p>
          </div>
        ),
      }),
      columnHelper.accessor('badge', {
        header: 'Badge',
        cell: ({ row }) => row.original.badge?.en ?? '—',
      }),
      columnHelper.accessor('theme', {
        header: 'Theme',
        cell: ({ getValue }) => {
          const theme = getValue();
          return (
            <div className="flex items-center gap-2">
              <span
                className="inline-block size-4 rounded-full ring-1 ring-border"
                style={{ background: OFFER_TICKER_THEME_GRADIENTS[theme] }}
              />
              <span className="text-sm">{OFFER_TICKER_THEME_LABELS[theme]}</span>
            </div>
          );
        },
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
      createDataTableActionsColumn<OfferTicker>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ticker ${row.original.id}`}>
            {canManage ? (
              <>
                <TableDropdownAction
                  icon={Pencil}
                  onClick={() => router.visit(`/admin/offer-tickers/${row.original.id}/edit`)}
                >
                  Edit
                </TableDropdownAction>
                <TableDropdownAction
                  icon={Power}
                  onClick={() => {
                    router.patch(`/admin/offer-tickers/${row.original.id}/toggle-active`, {}, {
                      preserveScroll: true,
                      only: ['offerTickers'],
                      onSuccess: () => showMutationSuccess('Ticker status updated'),
                      onError: () => showMutationError(null, 'Failed to update ticker status'),
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
          title="Offer Ticker"
          description="Manage promo messages shown in the home page marquee"
          icon={Megaphone}
        />
        {canManage ? (
          <Button onClick={() => router.visit('/admin/offer-tickers/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Offer Ticker
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        toolbar={
          <DataTableToolbar>
            <Input
              placeholder="Search tickers..."
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

      <DeleteOfferTickerDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        offerTicker={selectedForDelete}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedForDelete) return;
          setIsDeleting(true);
          router.delete(`/admin/offer-tickers/${selectedForDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
              showMutationSuccess('Offer ticker deleted');
              setDeleteOpen(false);
              setSelectedForDelete(null);
              reload();
            },
            onError: () => showMutationError(null, 'Failed to delete offer ticker'),
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </div>
  );
}
