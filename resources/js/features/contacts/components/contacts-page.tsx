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
import type { Contact, ContactMetadata } from '@/features/contacts/schemas/contact.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Contact>();

function formatDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function subjectLabel(subject: Contact['subject']) {
  switch (subject) {
    case 'corporate':
      return 'Corporate';
    case 'order':
      return 'Order';
    case 'message':
      return 'Message';
    default:
      return 'Message';
  }
}

function formatMetadata(metadata: ContactMetadata | null | undefined) {
  if (!metadata || typeof metadata !== 'object') return null;

  const entries: { label: string; value: string }[] = [];

  if (metadata.company) entries.push({ label: 'Company', value: metadata.company });
  if (metadata.job_title) entries.push({ label: 'Job title', value: metadata.job_title });
  if (metadata.product_name) entries.push({ label: 'Product', value: metadata.product_name });
  if (metadata.card_amount) entries.push({ label: 'Card amount', value: metadata.card_amount });
  if (metadata.vendor_slug) entries.push({ label: 'Vendor', value: metadata.vendor_slug });
  if (metadata.product_id != null) {
    entries.push({ label: 'Product ID', value: String(metadata.product_id) });
  }

  return entries.length > 0 ? entries : null;
}

type ContactsPageProps = {
  contacts: LaravelPaginator<Contact>;
};

export function ContactsPage({ contacts }: ContactsPageProps) {
  const {
    user,
    canViewContacts,
    canViewOwnContacts,
    canCreateContacts,
    canDeleteContacts,
    canCreateOwnContacts,
    canDeleteOwnContacts,
  } = useAuth();
  const isStaff = canViewContacts();
  const canView = isStaff || canViewOwnContacts();
  const canCreate = canCreateContacts() || canCreateOwnContacts();
  const lockContactEmail = canCreateOwnContacts() && !canCreateContacts();
  const canDeleteStaff = canDeleteContacts();
  const canDeleteOwn = canDeleteOwnContacts();
  const showActionsColumn = canView || canDeleteStaff || canDeleteOwn;

  const ownsContact = React.useCallback(
    (contact: Contact) =>
      contact.created_by != null && contact.created_by === user?.id,
    [user?.id],
  );

  const canDeleteContact = React.useCallback(
    (contact: Contact) => canDeleteStaff || (canDeleteOwn && ownsContact(contact)),
    [canDeleteOwn, canDeleteStaff, ownsContact],
  );
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

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDeleteStaff || canDeleteOwn ? [createDataTableSelectionColumn<Contact>()] : []),
      columnHelper.accessor('name', {
        header: 'From',
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email ?? '—'}</p>
          </div>
        ),
      }),
      ...(isStaff
        ? [
            columnHelper.accessor('subject', {
              header: 'Subject',
              cell: ({ getValue }) => (
                <Badge variant="outline">{subjectLabel(getValue())}</Badge>
              ),
            }),
          ]
        : []),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm">{getValue() ?? '—'}</span>
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
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Contact>({
        cell: ({ row }) => {
          const menuItems: React.ReactNode[] = [];

          if (canView) {
            menuItems.push(
              <TableDropdownAction
                key="view"
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
              </TableDropdownAction>,
            );
          }

          if (canDeleteContact(row.original)) {
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
  }, [canDeleteContact, canView, isStaff, markAsRead, openDelete, showActionsColumn]);

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { globalFilter, rowSelection, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    enableRowSelection: canDeleteStaff || canDeleteOwn,
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
                <span className="font-medium">Email:</span> {selected.email ?? '—'}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {selected.phone ?? '—'}
              </p>
              {isStaff ? (
                <p>
                  <span className="font-medium">Subject:</span>{' '}
                  {subjectLabel(selected.subject)}
                </p>
              ) : null}
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
              {formatMetadata(selected.metadata) ? (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="mb-2 font-medium">Additional details</p>
                  <ul className="space-y-1">
                    {formatMetadata(selected.metadata)?.map((item) => (
                      <li key={item.label}>
                        <span className="font-medium">{item.label}:</span> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="whitespace-pre-wrap">{selected.message ?? '—'}</p>
              {selected && canDeleteContact(selected) ? (
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
            email: user?.email ?? '',
          }}
          lockEmail={lockContactEmail}
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
      {canDeleteStaff || canDeleteOwn ? (
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
