import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Copy,
  ExternalLink,
  Eye,
  Loader2,
  Plus,
  QrCode,
  RefreshCw,
  Trash2,
  UserRoundPlus,
} from 'lucide-react';
import * as React from 'react';
import QRCode from 'react-qr-code';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  cardCodeFormSchema,
  cardDisplayName,
  generateCodeResponseSchema,
  type CardCode,
  type CardCustomerOption,
  type CardCodeFormValues,
} from '@/features/cards/schemas/card-code.schema';
import { fetchAvailableOrders } from '@/features/cards/api/card-codes.api';
import { CardCodeDetailDialog } from '@/features/cards/components/card-code-detail-dialog';
import { CardCodeAssignUserDialog } from '@/features/cards/components/card-code-assign-user-dialog';
import type { AvailableOrderOption } from '@/features/orders/schemas/order.schema';
import { useAuth } from '@/hooks/useAuth';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { messageFromLaravelResponseBody } from '@/lib/laravel-validation-message';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<CardCode>();

type CodesPageProps = {
  codes: LaravelPaginator<CardCode>;
  customers: CardCustomerOption[];
};

type CardWorkflowStatus = 'verified' | 'awaiting_verification' | 'unassigned';

function getWorkflowStatus(card: CardCode): CardWorkflowStatus {
  if (card.status === 'published') {
    return 'verified';
  }

  return card.user_id != null ? 'awaiting_verification' : 'unassigned';
}

function WorkflowBadge({ card }: { card: CardCode }) {
  const workflow = getWorkflowStatus(card);

  if (workflow === 'verified') {
    return <Badge variant="default">Verified</Badge>;
  }

  if (workflow === 'awaiting_verification') {
    return <Badge variant="secondary">Awaiting verification</Badge>;
  }

  return <Badge variant="outline">Unassigned</Badge>;
}

export function CodesPage({ codes, customers }: CodesPageProps) {
  const {
    canViewCards,
    canCreateCards,
    canUpdateCards,
    canDeleteCards,
  } = useAuth();
  const canView = canViewCards();
  const canCreate = canCreateCards();
  const canUpdate = canUpdateCards();
  const canDelete = canDeleteCards();
  const showActionsColumn = canView || canUpdate || canDelete;
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(codes, ['codes']);
  const { copy, isCopied } = useCopyToClipboardWithStatus();
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [createOpen, setCreateOpen] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const [selectedCode, setSelectedCode] = React.useState<CardCode | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [pendingDeleteId, setPendingDeleteId] = React.useState<number | null>(null);
  const [availableOrders, setAvailableOrders] = React.useState<AvailableOrderOption[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(false);

  const form = useForm<CardCodeFormValues>({
    resolver: zodResolver(cardCodeFormSchema),
    defaultValues: {
      customer_id: 0,
      order_id: 0,
      code: '',
    },
  });

  const selectedCustomerId = form.watch('customer_id');

  React.useEffect(() => {
    if (createOpen) {
      form.reset({ customer_id: 0, order_id: 0, code: '' });
      setAvailableOrders([]);
    }
  }, [createOpen, form]);

  React.useEffect(() => {
    if (!createOpen || !selectedCustomerId || selectedCustomerId <= 0) {
      setAvailableOrders([]);
      form.setValue('order_id', 0);
      return;
    }

    let cancelled = false;
    setIsLoadingOrders(true);

    fetchAvailableOrders(selectedCustomerId)
      .then((orders) => {
        if (!cancelled) {
          setAvailableOrders(orders);
          if (!orders.some((order) => order.id === form.getValues('order_id'))) {
            form.setValue('order_id', orders[0]?.id ?? 0);
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAvailableOrders([]);
          toast.error('Unable to load orders for this customer');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingOrders(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [createOpen, form, selectedCustomerId]);

  const generateCode = React.useCallback(async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/cards/generate', {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'same-origin',
      });

      const body = await response.json();
      const parsed = generateCodeResponseSchema.safeParse(body);

      if (!response.ok || !parsed.success) {
        throw new Error('Failed to generate code');
      }

      form.setValue('code', parsed.data.data.code, { shouldValidate: true });
    } catch {
      toast.error('Unable to generate a unique code');
    } finally {
      setIsGenerating(false);
    }
  }, [form]);

  const openAssign = React.useCallback((code: CardCode) => {
    setSelectedCode(code);
    setAssignOpen(true);
  }, []);

  const openDetails = React.useCallback((code: CardCode) => {
    setSelectedCode(code);
    setDetailOpen(true);
  }, []);

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDelete ? [createDataTableSelectionColumn<CardCode>()] : []),
      columnHelper.accessor('code', {
        header: 'Code',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-mono text-xs">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor((row) => cardDisplayName(row), {
        id: 'name',
        header: 'Customer',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor((row) => row.user?.phone ?? row.phone, {
        id: 'phone',
        header: 'Mobile',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('order.order_number', {
        id: 'order',
        header: 'Order',
        cell: ({ row }) => row.original.order?.order_number ?? '—',
      }),
      columnHelper.accessor('scan_url', {
        header: 'Link',
        cell: ({ row }) => (
          <div className="flex max-w-xs items-center gap-2">
            <a
              href={row.original.scan_url}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm text-primary underline-offset-4 hover:underline"
            >
              {row.original.scan_url}
            </a>
            <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
              <a href={row.original.scan_url} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        ),
      }),
      columnHelper.display({
        id: 'qr',
        header: 'QR',
        cell: ({ row }) => (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              setSelectedCode(row.original);
              setQrOpen(true);
            }}
          >
            <QrCode className="size-4" />
            View
          </Button>
        ),
      }),
      columnHelper.display({
        id: 'workflow',
        header: 'Workflow',
        cell: ({ row }) => <WorkflowBadge card={row.original} />,
      }),
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<CardCode>({
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
              <TableDropdownAction
                key="copy"
                icon={Copy}
                onClick={() => copy(row.original.scan_url)}
              >
                {isCopied ? 'Copied' : 'Copy link'}
              </TableDropdownAction>,
              <TableDropdownAction
                key="qr"
                icon={QrCode}
                onClick={() => {
                  setSelectedCode(row.original);
                  setQrOpen(true);
                }}
              >
                Show QR
              </TableDropdownAction>,
            );

            if (row.original.profile_url) {
              menuItems.push(
                <TableDropdownAction key="profile" icon={ExternalLink} asChild>
                  <a href={row.original.profile_url} target="_blank" rel="noreferrer">
                    Open profile
                  </a>
                </TableDropdownAction>,
              );
            }
          }

          if (canUpdate && row.original.order_id == null) {
            menuItems.push(
              <TableDropdownAction
                key="assign"
                icon={UserRoundPlus}
                onClick={() => openAssign(row.original)}
              >
                Assign user
              </TableDropdownAction>,
            );
          }

          if (canDelete) {
            menuItems.push(
              <TableDropdownAction
                key="delete"
                icon={Trash2}
                className="text-destructive focus:text-destructive"
                disabled={pendingDeleteId === row.original.id}
                onClick={() => {
                  setPendingDeleteId(row.original.id);
                  router.delete(`/cards/${row.original.id}`, {
                    preserveScroll: true,
                    only: ['codes'],
                    onSuccess: () => showMutationSuccess('Card code deleted'),
                    onError: () => showMutationError(null, 'Failed to delete card code'),
                    onFinish: () => setPendingDeleteId(null),
                  });
                }}
              >
                Delete
              </TableDropdownAction>,
            );
          }

          if (menuItems.length === 0) {
            return <span className="text-xs text-muted-foreground">—</span>;
          }

          return (
            <DataTableRowActionsMenu label={`Actions for ${row.original.code}`}>
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
    copy,
    isCopied,
    openAssign,
    openDetails,
    pendingDeleteId,
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
  });

  const handleCreate = form.handleSubmit((values) => {
    setIsSubmitting(true);
    router.post(
      '/cards',
      {
        code: values.code.toUpperCase(),
        order_id: values.order_id,
      },
      {
        preserveScroll: true,
        only: ['codes'],
        onSuccess: () => {
          showMutationSuccess('Card code created');
          setCreateOpen(false);
        },
        onError: (errors) => {
          const message =
            messageFromLaravelResponseBody({ errors }) ?? 'Failed to create card code';
          toast.error(message);
        },
        onFinish: () => setIsSubmitting(false),
      },
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          title="Cards"
          description="Link each card to a customer order, generate a code and QR, then the customer verifies to activate their profile."
          icon={QrCode}
          color="teal"
        />
        {canCreate ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create card
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{
          emptyMessage: canCreate
            ? 'No card codes yet. Create the first card to get started.'
            : 'No card codes found.',
        }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search codes..."
                className="h-9 w-full max-w-xs"
              />
            }
            end={
              <DataTableViewOptions
                table={table}
                showExport={false}
                onRefresh={reload}
                isRefreshing={isFetching}
              />
            }
          />
        }
        footer={<DataTableFooter table={table} />}
      />

      {canCreate ? (
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create card</DialogTitle>
            <DialogDescription>
              Select the customer and an order without a card yet, then generate a unique code.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleCreate} className="space-y-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer *</FormLabel>
                    <Select
                      value={field.value > 0 ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select customer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={String(customer.id)}>
                            {customer.name} ({customer.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order *</FormLabel>
                    <Select
                      value={field.value > 0 ? String(field.value) : undefined}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={
                        isSubmitting || isLoadingOrders || selectedCustomerId <= 0
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingOrders
                                ? 'Loading orders...'
                                : 'Select an order without a card'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableOrders.map((order) => (
                          <SelectItem key={order.id} value={String(order.id)}>
                            {order.order_number} — {order.product_name}
                            {order.source ? ` (${order.source})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCustomerId > 0 &&
                    !isLoadingOrders &&
                    availableOrders.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        This customer has no orders without a card. Create an order first.
                      </p>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="QDF2QL"
                          className="font-mono uppercase"
                          autoComplete="off"
                          disabled={isSubmitting}
                          onChange={(event) =>
                            field.onChange(event.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isGenerating || isSubmitting}
                        onClick={() => void generateCode()}
                      >
                        {isGenerating ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <>
                            <RefreshCw className="mr-2 size-4" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create card'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
        </Dialog>
      ) : null}

      {canUpdate ? (
        <CardCodeAssignUserDialog
          open={assignOpen}
          onOpenChange={setAssignOpen}
          cardCode={selectedCode}
        />
      ) : null}

      {canView ? (
        <CardCodeDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          cardCode={selectedCode}
        />
      ) : null}

      {canView ? (
        <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Scan QR code</DialogTitle>
            <DialogDescription>
              Scan this code to open {selectedCode?.scan_url ?? 'the card link'}.
            </DialogDescription>
          </DialogHeader>
          {selectedCode ? (
            <div className="flex flex-col items-center gap-4 py-2">
              <div className="rounded-xl border bg-white p-4">
                <QRCode value={selectedCode.scan_url} size={220} />
              </div>
              <div className="space-y-1 text-center">
                <p className="font-mono text-sm font-semibold">{selectedCode.code}</p>
                <p className="break-all text-xs text-muted-foreground">{selectedCode.scan_url}</p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      ) : null}
    </div>
  );
}
