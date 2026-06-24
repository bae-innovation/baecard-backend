import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, Mail, Plus, Trash2 } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ContactFormDialog } from '@/features/contacts/components/contact-form-dialog';
import { DeleteContactDialog } from '@/features/contacts/components/delete-contact-dialog';
import type { Contact } from '@/features/contacts/schemas/contact.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Contact>();

function formatDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

type ContactsPageProps = {
  contacts: LaravelPaginator<Contact>;
};

export function ContactsPage({ contacts }: ContactsPageProps) {
  const { hasAbility, user } = useAuth();
  const isStaff = hasAbility('contacts.view');
  const canCreate = hasAbility('contacts.create');
  const canDelete = hasAbility('contacts.delete');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(contacts, ['contacts']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [selected, setSelected] = React.useState<Contact | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] =
    React.useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const openDelete = React.useCallback((contact: Contact) => {
    setSelectedForDelete(contact);
    setDeleteOpen(true);
  }, []);

  const markAsRead = React.useCallback((contactId: number) => {
    router.patch(`/contacts/${contactId}/mark-read`, {}, {
      preserveScroll: true,
      only: ['contacts'],
    });
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<Contact>(),
      columnHelper.accessor('name', {
        header: 'From',
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      }),
      columnHelper.accessor('message', {
        header: 'Message',
        cell: ({ getValue }) => (
          <p className="max-w-xs truncate text-sm">{getValue()}</p>
        ),
      }),
      ...(isStaff
        ? [
            columnHelper.accessor('ip_address', {
              header: 'IP Address',
              cell: ({ getValue }) => (
                <span className="font-mono text-sm">{getValue() ?? '—'}</span>
              ),
            }),
          ]
        : []),
      columnHelper.accessor('created_at', {
        header: 'Received',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm">{formatDate(getValue())}</span>
        ),
      }),
      ...(isStaff
        ? [
            columnHelper.accessor('is_read', {
              header: 'Status',
              cell: ({ getValue }) => (
                <Badge variant={getValue() ? 'secondary' : 'default'}>
                  {getValue() ? 'Read' : 'Unread'}
                </Badge>
              ),
            }),
          ]
        : []),
      createDataTableActionsColumn<Contact>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
            <TableDropdownAction
              icon={Eye}
              onClick={() => {
                setSelected(row.original);
                setViewOpen(true);
                if (isStaff && !row.original.is_read) {
                  markAsRead(row.original.id);
                }
              }}
            >
              View
            </TableDropdownAction>
            {canDelete ? (
              <TableDropdownAction
                icon={Trash2}
                className="text-destructive focus:text-destructive"
                onClick={() => openDelete(row.original)}
              >
                Delete
              </TableDropdownAction>
            ) : null}
          </DataTableRowActionsMenu>
        ),
      }),
    ],
    [canDelete, isStaff, markAsRead, openDelete],
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
          title={isStaff ? 'Contact Messages' : 'My Messages'}
          description={
            isStaff
              ? 'Website contact form submissions'
              : 'Messages you have sent to the team'
          }
          icon={Mail}
        />
        {canCreate ? (
          <Button type="button" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New message
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={table.getAllColumns().length}
        bodyProps={{ emptyMessage: 'No contact messages yet.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search contacts..."
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
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Email:</span> {selected.email}
              </p>
              <p>
                <span className="font-medium">Received:</span>{' '}
                {formatDate(selected.created_at)}
              </p>
              {isStaff && selected.ip_address ? (
                <p>
                  <span className="font-medium">IP:</span> {selected.ip_address}
                </p>
              ) : null}
              {isStaff ? (
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  {selected.is_read ? 'Read' : 'Unread'}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap">{selected.message}</p>
              {canDelete ? (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(selected)}
                >
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      {canCreate ? (
        <ContactFormDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          defaultValues={{
            name: user?.name ?? '',
            email: user?.email ?? '',
          }}
          isSubmitting={isSubmitting}
          onSubmit={async (values) => {
            setIsSubmitting(true);
            router.post('/contacts', values, {
              preserveScroll: true,
              only: ['contacts'],
              onSuccess: () => {
                showMutationSuccess('Message sent');
                setCreateOpen(false);
              },
              onError: () => showMutationError(null, 'Failed to send message'),
              onFinish: () => setIsSubmitting(false),
            });
          }}
        />
      ) : null}
      {canDelete ? (
        <DeleteContactDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          contact={selectedForDelete}
          isDeleting={isDeleting}
          onConfirm={async () => {
            if (!selectedForDelete) return;
            setIsDeleting(true);
            router.delete(`/contacts/${selectedForDelete.id}`, {
              onSuccess: () => {
                showMutationSuccess('Contact deleted');
                setViewOpen(false);
                setDeleteOpen(false);
                setSelectedForDelete(null);
              },
              onError: () => showMutationError(null, 'Failed to delete contact'),
              onFinish: () => setIsDeleting(false),
            });
          }}
        />
      ) : null}
    </div>
  );
}
