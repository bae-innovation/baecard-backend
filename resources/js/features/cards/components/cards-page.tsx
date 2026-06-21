import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Copy,
  CreditCard,
  ExternalLink,
  IdCard,
  RefreshCw,
  Sparkles,
  UserX,
  Users,
} from 'lucide-react';
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
import { RoleBadges } from '@/components/shared/role-badges';
import { TableDropdownAction } from '@/components/shared/table-dropdown-action';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  CardUserSummary,
  GeneratedCard,
} from '@/features/cards/schemas/card.schema';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

const assignedColumnHelper = createColumnHelper<GeneratedCard>();
const unassignedColumnHelper = createColumnHelper<CardUserSummary>();

function CardsDataTable<T>({
  data,
  columns,
  emptyMessage,
  searchPlaceholder,
  onRefresh,
  isRefreshing = false,
}: {
  data: T[];
  columns: Parameters<typeof useReactTable<T>>[0]['columns'];
  emptyMessage: string;
  searchPlaceholder: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}) {
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});

  const tableColumns = React.useMemo(
    () => [createDataTableSelectionColumn<T>(), ...(columns ?? [])],
    [columns],
  );

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: { globalFilter, rowSelection },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <DataTableLayout
      table={table}
      colSpan={table.getAllColumns().length}
      stickyToolbar={false}
      bodyProps={{ emptyMessage }}
      toolbar={
        <DataTableToolbar
          start={
            <Input
              value={globalFilter}
              onChange={(event) => setGlobalFilter(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-9 w-full max-w-xs"
            />
          }
          end={
            <DataTableViewOptions
              table={table}
              showExport={false}
              onRefresh={onRefresh}
              isRefreshing={isRefreshing}
            />
          }
        />
      }
      footer={<DataTableFooter table={table} compactLayout />}
    />
  );
}

type CardsPageProps = {
  generated: GeneratedCard[];
  not_generated: CardUserSummary[];
};

export function CardsPage({ generated, not_generated }: CardsPageProps) {
  const { copy, isCopied } = useCopyToClipboardWithStatus();
  const [activeTab, setActiveTab] = React.useState('assigned');
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [pendingUserId, setPendingUserId] = React.useState<number | null>(null);

  const reload = React.useCallback(() => {
    setIsRefreshing(true);
    router.reload({
      only: ['generated', 'not_generated'],
      onFinish: () => setIsRefreshing(false),
    });
  }, []);

  const assignedColumns = React.useMemo(
    () => [
      assignedColumnHelper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
      }),
      assignedColumnHelper.display({
        id: 'roles',
        header: 'Role',
        cell: ({ row }) => <RoleBadges roles={row.original.roles} />,
      }),
      assignedColumnHelper.accessor('uid', {
        header: 'Card UID',
        cell: ({ getValue }) => (
          <Badge variant="secondary" className="font-mono text-xs">
            {getValue()}
          </Badge>
        ),
      }),
      assignedColumnHelper.accessor('card_url', {
        header: 'Card URL',
        cell: ({ getValue }) => (
          <div className="flex max-w-xs items-center gap-2">
            <a
              href={getValue()}
              target="_blank"
              rel="noreferrer"
              className="truncate text-sm text-primary underline-offset-4 hover:underline"
            >
              {getValue()}
            </a>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0"
              aria-label="Open card URL"
              asChild
            >
              <a href={getValue()} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        ),
      }),
      createDataTableActionsColumn<GeneratedCard>({
        cell: ({ row }) => {
          const card = row.original;
          return (
            <DataTableRowActionsMenu label={`Actions for ${card.name}`}>
              <TableDropdownAction icon={Copy} onClick={() => copy(card.card_url)}>
                {isCopied ? 'Copied' : 'Copy link'}
              </TableDropdownAction>
              <TableDropdownAction
                icon={RefreshCw}
                disabled={pendingUserId === card.id}
                onClick={() => {
                  setPendingUserId(card.id);
                  router.post(`/cards/${card.id}/regenerate`, {}, {
                    preserveScroll: true,
                    only: ['generated', 'not_generated'],
                    onSuccess: () => showMutationSuccess('Business card regenerated successfully'),
                    onError: () => showMutationError(null, 'Failed to regenerate card'),
                    onFinish: () => setPendingUserId(null),
                  });
                }}
              >
                Regenerate
              </TableDropdownAction>
              <TableDropdownAction icon={ExternalLink} asChild>
                <a href={card.card_url} target="_blank" rel="noreferrer">
                  Open card
                </a>
              </TableDropdownAction>
            </DataTableRowActionsMenu>
          );
        },
      }),
    ],
    [copy, isCopied, pendingUserId],
  );

  const unassignedColumns = React.useMemo(
    () => [
      unassignedColumnHelper.accessor('name', {
        header: 'User',
        cell: ({ row }) => (
          <div className="min-w-0">
            <p className="font-medium text-foreground">{row.original.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {row.original.email}
            </p>
          </div>
        ),
      }),
      unassignedColumnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">{getValue() ?? '—'}</span>
        ),
      }),
      unassignedColumnHelper.display({
        id: 'roles',
        header: 'Role',
        cell: ({ row }) => <RoleBadges roles={row.original.roles} />,
      }),
      createDataTableActionsColumn<CardUserSummary>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
            <TableDropdownAction
              icon={Sparkles}
              disabled={pendingUserId === row.original.id}
              onClick={() => {
                setPendingUserId(row.original.id);
                router.post(`/cards/${row.original.id}/generate`, {}, {
                  preserveScroll: true,
                  only: ['generated', 'not_generated'],
                  onSuccess: () => {
                    showMutationSuccess('Business card generated successfully');
                    setActiveTab('assigned');
                  },
                  onError: () => showMutationError(null, 'Failed to generate card'),
                  onFinish: () => setPendingUserId(null),
                });
              }}
            >
              Generate card
            </TableDropdownAction>
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [pendingUserId],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 py-4">
      <PageTitle
        title="Card Management"
        icon={CreditCard}
        color="teal"
        description="Generate NFC/QR business cards, track assignments, and manage unassigned users."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-teal-200/60 bg-gradient-to-br from-teal-50/70 to-background dark:border-teal-900/50 dark:from-teal-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IdCard className="size-4 text-teal-600 dark:text-teal-400" />
              Assigned cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {generated.length.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200/60 bg-gradient-to-br from-amber-50/70 to-background dark:border-amber-900/50 dark:from-amber-950/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <UserX className="size-4 text-amber-600 dark:text-amber-400" />
              Unassigned users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {not_generated.length.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Users className="size-4" />
              Total users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">
              {(generated.length + not_generated.length).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-0 flex-1">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:w-auto sm:grid-cols-2">
          <TabsTrigger value="assigned" className="gap-2">
            <IdCard className="size-4" />
            Assigned cards
            <Badge variant="secondary" className="ml-1">
              {generated.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="unassigned" className="gap-2">
            <UserX className="size-4" />
            Unassigned users
            <Badge variant="secondary" className="ml-1">
              {not_generated.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned" className="mt-4 min-h-0">
          <CardsDataTable
            data={generated}
            columns={assignedColumns}
            emptyMessage="No cards assigned yet. Switch to Unassigned users to generate cards."
            searchPlaceholder="Search assigned cards..."
            onRefresh={reload}
            isRefreshing={isRefreshing}
          />
        </TabsContent>

        <TabsContent value="unassigned" className="mt-4 min-h-0">
          <CardsDataTable
            data={not_generated}
            columns={unassignedColumns}
            emptyMessage="All users have cards assigned. Great work!"
            searchPlaceholder="Search unassigned users..."
            onRefresh={reload}
            isRefreshing={isRefreshing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
