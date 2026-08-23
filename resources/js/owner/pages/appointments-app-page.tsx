import { router } from '@inertiajs/react';
import {
  Calendar,
  Clock,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DeleteAppointmentDialog } from '@/features/appointments/components/delete-appointment-dialog';
import type { Appointment } from '@/features/appointments/schemas/appointment.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { OwnerAppEmptyState } from '@/owner/components/owner-app-empty-state';
import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';
import { OwnerAppPagination } from '@/owner/components/owner-app-pagination';
import { OwnerAppSearchRow } from '@/owner/components/owner-app-search-row';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';
import type { LaravelPaginator } from '@/types/inertia';

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function customerLabel(appointment: Appointment) {
  if (appointment.customer?.name) {
    return appointment.customer.name;
  }

  if (appointment.guest_name) {
    return appointment.guest_name;
  }

  if (appointment.customer_id) {
    return `#${appointment.customer_id}`;
  }

  return 'Guest';
}

function statusVariant(status: Appointment['status']) {
  switch (status) {
    case 'confirmed':
      return 'default';
    case 'completed':
      return 'secondary';
    case 'cancelled':
      return 'destructive';
    default:
      return 'outline';
  }
}

type AppointmentsAppPageProps = {
  appointments: LaravelPaginator<Appointment>;
};

export function AppointmentsAppPage({ appointments }: AppointmentsAppPageProps) {
  const { user, canCreateAppointments, canUpdateAppointments, canDeleteAppointments, canCreateOwnAppointments, canUpdateOwnAppointments, canDeleteOwnAppointments } = useAuth();

  const canCreate = canCreateAppointments() || canCreateOwnAppointments();
  const canUpdateAny = canUpdateAppointments();
  const canDeleteAny = canDeleteAppointments();
  const canUpdateOwn = canUpdateOwnAppointments();
  const canDeleteOwn = canDeleteOwnAppointments();

  const ownsAppointment = React.useCallback(
    (appointment: Appointment) =>
      appointment.created_by != null && appointment.created_by === user?.id,
    [user?.id],
  );

  const canUpdateAppointment = React.useCallback(
    (appointment: Appointment) =>
      canUpdateAny || (canUpdateOwn && ownsAppointment(appointment)),
    [canUpdateOwn, canUpdateAny, ownsAppointment],
  );

  const canDeleteAppointment = React.useCallback(
    (appointment: Appointment) =>
      canDeleteAny || (canDeleteOwn && ownsAppointment(appointment)),
    [canDeleteOwn, canDeleteAny, ownsAppointment],
  );

  const { data, pagination, reload, isFetching } = useInertiaPagination(
    appointments,
    ['appointments'],
  );
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Appointment | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item) => {
      const haystack = [
        item.title,
        item.description,
        customerLabel(item),
        item.guest_phone,
        item.location,
        item.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [data, search]);

  const openDetail = (appointment: Appointment) => {
    setSelected(appointment);
    setDetailOpen(true);
  };

  const openDelete = (appointment: Appointment) => {
    setSelectedForDelete(appointment);
    setDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      { page, per_page: pagination.pageSize },
      { preserveState: true, preserveScroll: true, only: ['appointments'] },
    );
  };

  return (
    <div className="owner-page">
      <OwnerAppPageHeader
        title="Appointments"
        description="Your scheduled meetings and bookings"
        icon={Calendar}
        action={
          canCreate ? (
            <Button
              type="button"
              onClick={() => router.visit('/appointments/create')}
            >
              <Plus className="owner-icon-inline" />
              New
            </Button>
          ) : null
        }
      />

      <OwnerAppSearchRow
        value={search}
        onChange={setSearch}
        placeholder="Search appointments…"
        onRefresh={reload}
        isRefreshing={isFetching}
      />

      {filtered.length === 0 ? (
        <OwnerAppEmptyState
          icon={Calendar}
          title={search ? 'No matches' : 'No appointments yet'}
          description={
            search
              ? 'Try a different search term.'
              : canCreate
                ? 'Create your first appointment to get started.'
                : 'You have no appointments right now.'
          }
          action={
            canCreate && !search ? (
              <Button
                type="button"
                onClick={() => router.visit('/appointments/create')}
              >
                <Plus className="owner-icon-inline" />
                New appointment
              </Button>
            ) : null
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((appointment) => (
            <li key={appointment.id}>
              <article
                className="owner-list-card"
                role="button"
                tabIndex={0}
                onClick={() => openDetail(appointment)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(appointment);
                  }
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <h2 className="owner-h2 min-w-0 leading-snug">{appointment.title}</h2>
                  <Badge variant={statusVariant(appointment.status)} className="shrink-0 capitalize">
                    {appointment.status}
                  </Badge>
                </div>

                <div className="owner-body mt-3 space-y-2.5 text-muted-foreground">
                  <p className="flex items-center gap-2.5">
                    <Calendar className="owner-icon-list-primary" aria-hidden />
                    <span>{formatDateTime(appointment.appointment_date)}</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="owner-icon-list" aria-hidden />
                    <span>{appointment.duration_minutes} minutes</span>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <UserRound className="owner-icon-list" aria-hidden />
                    <span className="truncate">{customerLabel(appointment)}</span>
                  </p>
                  {appointment.location ? (
                    <p className="flex items-center gap-2.5">
                      <MapPin className="owner-icon-list" aria-hidden />
                      <span className="truncate">{appointment.location}</span>
                    </p>
                  ) : null}
                </div>

                {appointment.description ? (
                  <p className="owner-body mt-3 line-clamp-2 text-muted-foreground">
                    {appointment.description}
                  </p>
                ) : null}

                {(canUpdateAppointment(appointment) || canDeleteAppointment(appointment)) && (
                  <div
                    className="mt-3 flex gap-2 border-t pt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canUpdateAppointment(appointment) ? (
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.visit(`/appointments/${appointment.id}/edit`)}
                      >
                        <Pencil className="owner-icon-inline" />
                        Edit
                      </Button>
                    ) : null}
                    {canDeleteAppointment(appointment) ? (
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'text-destructive hover:text-destructive',
                          canUpdateAppointment(appointment) ? 'flex-1' : 'w-full',
                        )}
                        onClick={() => openDelete(appointment)}
                      >
                        <Trash2 className="owner-icon-inline" />
                        Delete
                      </Button>
                    ) : null}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}

      <OwnerAppPagination paginator={appointments} onPageChange={handlePageChange} />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-2xl px-4 pb-6">
          <SheetHeader className="text-left">
            <SheetTitle>{selected?.title}</SheetTitle>
          </SheetHeader>
          {selected ? (
            <div className="owner-body mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(selected.status)} className="capitalize">
                  {selected.status}
                </Badge>
              </div>
              <p>
                <span className="font-medium text-foreground">Customer:</span>{' '}
                {customerLabel(selected)}
              </p>
              {selected.guest_phone ? (
                <p>
                  <span className="font-medium text-foreground">Phone:</span>{' '}
                  {selected.guest_phone}
                </p>
              ) : null}
              {selected.guest_email ? (
                <p>
                  <span className="font-medium text-foreground">Email:</span>{' '}
                  {selected.guest_email}
                </p>
              ) : null}
              <p>
                <span className="font-medium text-foreground">When:</span>{' '}
                {formatDateTime(selected.appointment_date)}
              </p>
              <p>
                <span className="font-medium text-foreground">Duration:</span>{' '}
                {selected.duration_minutes} minutes
              </p>
              {selected.location ? (
                <p>
                  <span className="font-medium text-foreground">Location:</span>{' '}
                  {selected.location}
                </p>
              ) : null}
              {selected.description ? (
                <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3">
                  {selected.description}
                </p>
              ) : null}
              {selected.notes ? (
                <p className="whitespace-pre-wrap text-muted-foreground">{selected.notes}</p>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <DeleteAppointmentDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        appointment={selectedForDelete}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedForDelete) return;
          setIsDeleting(true);
          router.delete(`/appointments/${selectedForDelete.id}`, {
            onSuccess: () => {
              showMutationSuccess('Appointment deleted');
              setDeleteOpen(false);
              setDetailOpen(false);
              setSelectedForDelete(null);
            },
            onError: () => showMutationError(null, 'Failed to delete appointment'),
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </div>
  );
}
