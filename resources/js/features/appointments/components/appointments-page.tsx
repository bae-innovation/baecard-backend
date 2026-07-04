import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Calendar, Eye, Pencil, Plus, Trash2 } from 'lucide-react';
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
import { DeleteAppointmentDialog } from '@/features/appointments/components/delete-appointment-dialog';
import type { Appointment } from '@/features/appointments/schemas/appointment.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Appointment>();

function formatDateTime(value: string) {
  return new Date(value).toLocaleString();
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

type AppointmentsPageProps = {
  appointments: LaravelPaginator<Appointment>;
};

export function AppointmentsPage({ appointments }: AppointmentsPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('appointments.manage');
  const canCreate = canManage || hasAbility('appointments.view_own');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(appointments, ['appointments']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] =
    React.useState<Appointment | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [selectedForView, setSelectedForView] = React.useState<Appointment | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const canModifyAppointment = React.useCallback(
    () => canManage,
    [canManage],
  );

  const openDelete = React.useCallback((appointment: Appointment) => {
    setSelectedForDelete(appointment);
    setDeleteOpen(true);
  }, []);

  const openView = React.useCallback((appointment: Appointment) => {
    setSelectedForView(appointment);
    setViewOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<Appointment>(),
      columnHelper.accessor('title', {
        header: 'Appointment',
        cell: ({ row }) => (
          <div className="min-w-[180px]">
            <p className="font-medium">{row.original.title}</p>
            {row.original.description ? (
              <p className="truncate text-sm text-muted-foreground">
                {row.original.description}
              </p>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor('customer', {
        header: 'Customer',
        cell: ({ row }) => (
          <div className="min-w-[140px]">
            <p>{customerLabel(row.original)}</p>
            {row.original.guest_phone ? (
              <p className="text-sm text-muted-foreground">{row.original.guest_phone}</p>
            ) : null}
          </div>
        ),
      }),
      columnHelper.accessor('appointment_date', {
        header: 'Date & Time',
        cell: ({ getValue }) => (
          <span className="whitespace-nowrap text-sm">{formatDateTime(getValue())}</span>
        ),
      }),
      columnHelper.accessor('duration_minutes', {
        header: 'Duration',
        cell: ({ getValue }) => `${getValue()} min`,
      }),
      columnHelper.accessor('location', {
        header: 'Location',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      }),
      createDataTableActionsColumn<Appointment>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.title}`}>
            <TableDropdownAction icon={Eye} onClick={() => openView(row.original)}>
              View
            </TableDropdownAction>
            {canModifyAppointment() ? (
              <>
                <TableDropdownAction
                  icon={Pencil}
                  onClick={() => router.visit(`/appointments/${row.original.id}/edit`)}
                >
                  Edit
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
    [canModifyAppointment, openDelete, openView],
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
        <PageTitle title="Appointments" description="Manage appointments" icon={Calendar} />
        {canCreate ? (
          <Button type="button" onClick={() => router.visit('/appointments/create')}>
            <Plus className="mr-2 h-4 w-4" />
            New Appointment
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={table.getAllColumns().length}
        bodyProps={{ emptyMessage: 'No appointments found.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search appointments..."
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
            <DialogTitle>{selectedForView?.title}</DialogTitle>
          </DialogHeader>
          {selectedForView ? (
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Customer:</span>{' '}
                {customerLabel(selectedForView)}
              </p>
              {selectedForView.guest_phone ? (
                <p>
                  <span className="font-medium">Phone:</span> {selectedForView.guest_phone}
                </p>
              ) : null}
              {selectedForView.guest_email ? (
                <p>
                  <span className="font-medium">Email:</span> {selectedForView.guest_email}
                </p>
              ) : null}
              <p>
                <span className="font-medium">Date:</span>{' '}
                {formatDateTime(selectedForView.appointment_date)}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {selectedForView.duration_minutes} minutes
              </p>
              <p>
                <span className="font-medium">Status:</span> {selectedForView.status}
              </p>
              {selectedForView.location ? (
                <p>
                  <span className="font-medium">Location:</span> {selectedForView.location}
                </p>
              ) : null}
              {selectedForView.description ? (
                <p className="whitespace-pre-wrap">{selectedForView.description}</p>
              ) : null}
              {selectedForView.notes ? (
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {selectedForView.notes}
                </p>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
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
