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
  cardCodeFormSchema,
  generateCodeResponseSchema,
  type CardCode,
  type CardCodeAssignableUser,
  type CardCodeFormValues,
} from '@/features/cards/schemas/card-code.schema';
import { CardCodeDetailDialog } from '@/features/cards/components/card-code-detail-dialog';
import { CardCodeAssignUserDialog } from '@/features/cards/components/card-code-assign-user-dialog';
import { CardCodeUserSearchPicker } from '@/features/cards/components/card-code-user-search-picker';
import { useAuth } from '@/hooks/useAuth';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { messageFromLaravelResponseBody } from '@/lib/laravel-validation-message';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<CardCode>();

type CodesPageProps = {
  codes: LaravelPaginator<CardCode>;
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

export function CodesPage({ codes }: CodesPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('dashboard.card.manage');
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
  const [selectedAssignUser, setSelectedAssignUser] =
    React.useState<CardCodeAssignableUser | null>(null);

  const form = useForm<CardCodeFormValues>({
    resolver: zodResolver(cardCodeFormSchema),
    defaultValues: {
      code: '',
      name: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (createOpen) {
      form.reset({ code: '', name: '', phone: '' });
      setSelectedAssignUser(null);
    }
  }, [createOpen, form]);

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

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<CardCode>(),
      columnHelper.accessor('code', {
        header: 'Code',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-mono text-xs">
            {getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ getValue }) => getValue(),
      }),
      columnHelper.accessor('phone', {
        header: 'Mobile',
        cell: ({ getValue }) => getValue() ?? '—',
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
      createDataTableActionsColumn<CardCode>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.code}`}>
            <TableDropdownAction
              icon={Eye}
              onClick={() => openDetails(row.original)}
            >
              View details
            </TableDropdownAction>
            <TableDropdownAction
              icon={Copy}
              onClick={() => copy(row.original.scan_url)}
            >
              {isCopied ? 'Copied' : 'Copy link'}
            </TableDropdownAction>
            <TableDropdownAction
              icon={QrCode}
              onClick={() => {
                setSelectedCode(row.original);
                setQrOpen(true);
              }}
            >
              Show QR
            </TableDropdownAction>
            {row.original.profile_url ? (
              <TableDropdownAction icon={ExternalLink} asChild>
                <a href={row.original.profile_url} target="_blank" rel="noreferrer">
                  Open profile
                </a>
              </TableDropdownAction>
            ) : null}
            {canManage ? (
              <>
                <TableDropdownAction
                  icon={UserRoundPlus}
                  onClick={() => openAssign(row.original)}
                >
                  Assign user
                </TableDropdownAction>
                <TableDropdownAction
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
              </TableDropdownAction>
              </>
            ) : null}
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [canManage, copy, isCopied, openAssign, openDetails, pendingDeleteId],
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

  const handleCreate = form.handleSubmit((values) => {
    setIsSubmitting(true);
    router.post(
      '/cards',
      {
        code: values.code.toUpperCase(),
        name: values.name,
        phone: values.phone || null,
        user_id: selectedAssignUser?.id ?? null,
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
          description="Generate a code and QR, assign a customer, then the user verifies to activate their public profile link."
          icon={QrCode}
          color="teal"
        />
        {canManage ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create card
          </Button>
        ) : null}
      </div>

      <DataTableLayout
        table={table}
        colSpan={table.getAllColumns().length}
        bodyProps={{ emptyMessage: 'No card codes yet.' }}
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

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create card</DialogTitle>
            <DialogDescription>
              Generate a unique code and QR link. Optionally assign a customer now, or leave
              unassigned for the recipient to register when they scan the card.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleCreate} className="space-y-4">
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

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Recipient name" disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+880..." disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2 rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Assign customer (optional)</p>
                  <p className="text-xs text-muted-foreground">
                    Search by email or phone if the recipient already has an account.
                    You can also assign later from the row actions menu.
                  </p>
                </div>
                <CardCodeUserSearchPicker
                  selectedUser={selectedAssignUser}
                  onSelect={setSelectedAssignUser}
                  disabled={isSubmitting}
                  emailInputId="create-assign-email"
                  phoneInputId="create-assign-phone"
                />
              </div>

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

      <CardCodeAssignUserDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        cardCode={selectedCode}
      />

      <CardCodeDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        cardCode={selectedCode}
      />

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
    </div>
  );
}
