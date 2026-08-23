import { router } from '@inertiajs/react';
import { Mail, Phone, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ContactFormDialog } from '@/features/contacts/components/contact-form-dialog';
import { DeleteContactDialog } from '@/features/contacts/components/delete-contact-dialog';
import type { Contact, ContactMetadata } from '@/features/contacts/schemas/contact.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { OwnerAppEmptyState } from '@/owner/components/owner-app-empty-state';
import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';
import { OwnerAppPagination } from '@/owner/components/owner-app-pagination';
import { OwnerAppSearchRow } from '@/owner/components/owner-app-search-row';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';
import type { LaravelPaginator } from '@/types/inertia';

function formatDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
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

type ContactsAppPageProps = {
  contacts: LaravelPaginator<Contact>;
};

export function ContactsAppPage({ contacts }: ContactsAppPageProps) {
  const {
    user,
    canViewContacts,
    canCreateContacts,
    canDeleteContacts,
    canCreateOwnContacts,
    canDeleteOwnContacts,
  } = useAuth();

  const isStaff = canViewContacts();
  const canCreate = canCreateContacts() || canCreateOwnContacts();
  const lockContactEmail = canCreateOwnContacts() && !canCreateContacts();
  const canDeleteStaff = canDeleteContacts();
  const canDeleteOwn = canDeleteOwnContacts();

  const ownsContact = React.useCallback(
    (contact: Contact) =>
      contact.created_by != null && contact.created_by === user?.id,
    [user?.id],
  );

  const canDeleteContact = React.useCallback(
    (contact: Contact) => canDeleteStaff || (canDeleteOwn && ownsContact(contact)),
    [canDeleteOwn, canDeleteStaff, ownsContact],
  );

  const { data, pagination, reload, isFetching } = useInertiaPagination(contacts, ['contacts']);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Contact | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item) => {
      const haystack = [
        item.name,
        item.email,
        item.phone,
        item.message,
        item.subject,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [data, search]);

  const markAsRead = React.useCallback((contactId: number) => {
    router.patch(`/contacts/${contactId}/mark-read`, {}, {
      preserveScroll: true,
      only: ['contacts'],
    });
  }, []);

  const openDetail = (contact: Contact) => {
    setSelected(contact);
    setDetailOpen(true);
    if (isStaff && !contact.is_read) {
      markAsRead(contact.id);
    }
  };

  const openDelete = (contact: Contact) => {
    setSelectedForDelete(contact);
    setDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      { page, per_page: pagination.pageSize },
      { preserveState: true, preserveScroll: true, only: ['contacts'] },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <OwnerAppPageHeader
        title={isStaff ? 'Contact messages' : 'My messages'}
        description={
          isStaff
            ? 'Website contact form submissions'
            : 'Messages you have sent to the team'
        }
        icon={Mail}
        action={
          canCreate ? (
            <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="mr-1.5 size-4" />
              New
            </Button>
          ) : null
        }
      />

      <OwnerAppSearchRow
        value={search}
        onChange={setSearch}
        placeholder="Search messages…"
        onRefresh={reload}
        isRefreshing={isFetching}
      />

      {filtered.length === 0 ? (
        <OwnerAppEmptyState
          icon={Mail}
          title={search ? 'No matches' : 'No messages yet'}
          description={
            search
              ? 'Try a different search term.'
              : canCreate
                ? 'Send a message to get in touch with the team.'
                : 'You have no messages right now.'
          }
          action={
            canCreate && !search ? (
              <Button type="button" size="sm" onClick={() => setCreateOpen(true)}>
                <Plus className="mr-1.5 size-4" />
                New message
              </Button>
            ) : null
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((contact) => (
            <li key={contact.id}>
              <article
                className={cn(
                  'rounded-xl border bg-card p-4 shadow-sm transition-colors active:bg-muted/40',
                  isStaff && !contact.is_read && 'border-primary/40 bg-primary/5',
                )}
                role="button"
                tabIndex={0}
                onClick={() => openDetail(contact)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(contact);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {isStaff && !contact.is_read ? (
                        <span
                          className="size-2 shrink-0 rounded-full bg-primary"
                          aria-label="Unread"
                        />
                      ) : null}
                      <h2 className="truncate font-semibold">{contact.name}</h2>
                    </div>
                    {contact.email ? (
                      <p className="truncate text-sm text-muted-foreground">{contact.email}</p>
                    ) : null}
                  </div>
                  {isStaff ? (
                    <Badge variant={contact.is_read ? 'secondary' : 'default'} className="shrink-0">
                      {contact.is_read ? 'Read' : 'Unread'}
                    </Badge>
                  ) : null}
                </div>

                {isStaff && contact.subject ? (
                  <Badge variant="outline" className="mt-2 capitalize">
                    {subjectLabel(contact.subject)}
                  </Badge>
                ) : null}

                {contact.message ? (
                  <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {contact.message}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {contact.phone ? (
                    <span className="flex items-center gap-1">
                      <Phone className="size-3.5" aria-hidden />
                      {contact.phone}
                    </span>
                  ) : null}
                  <span>{formatDate(contact.created_at)}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}

      <OwnerAppPagination paginator={contacts} onPageChange={handlePageChange} />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-2xl px-4 pb-6">
          <SheetHeader className="text-left">
            <SheetTitle>{selected?.name}</SheetTitle>
          </SheetHeader>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              <p>
                <span className="font-medium text-foreground">Email:</span>{' '}
                {selected.email ?? '—'}
              </p>
              <p>
                <span className="font-medium text-foreground">Phone:</span>{' '}
                {selected.phone ?? '—'}
              </p>
              {isStaff ? (
                <p>
                  <span className="font-medium text-foreground">Subject:</span>{' '}
                  {subjectLabel(selected.subject)}
                </p>
              ) : null}
              <p>
                <span className="font-medium text-foreground">Received:</span>{' '}
                {formatDate(selected.created_at)}
              </p>
              {formatMetadata(selected.metadata) ? (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="mb-2 font-medium text-foreground">Additional details</p>
                  <ul className="space-y-1">
                    {formatMetadata(selected.metadata)?.map((item) => (
                      <li key={item.label}>
                        <span className="font-medium">{item.label}:</span> {item.value}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3">
                {selected.message ?? '—'}
              </p>
              {canDeleteContact(selected) ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => openDelete(selected)}
                >
                  <Trash2 className="mr-1.5 size-4" />
                  Delete message
                </Button>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      {canCreate ? (
        <ContactFormDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          defaultValues={{ email: user?.email ?? '' }}
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
                setDetailOpen(false);
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
