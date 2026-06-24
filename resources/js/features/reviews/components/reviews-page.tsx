import { router } from '@inertiajs/react';
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Eye, EyeOff, Pencil, Plus, Star, Trash2 } from 'lucide-react';
import * as React from 'react';
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
import { Input } from '@/components/ui/input';
import { DeleteReviewDialog } from '@/features/reviews/components/delete-review-dialog';
import { ReviewDetailDialog } from '@/features/reviews/components/review-detail-dialog';
import { ReviewFormDialog } from '@/features/reviews/components/review-form-dialog';
import {
  serializeReviewFormPayload,
  type Review,
  type ReviewFormValues,
} from '@/features/reviews/schemas/review.schema';
import { useAuth } from '@/hooks/useAuth';
import { useInertiaPagination } from '@/hooks/useInertiaPagination';
import { messageFromLaravelResponseBody } from '@/lib/laravel-validation-message';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import type { LaravelPaginator } from '@/types/inertia';

const columnHelper = createColumnHelper<Review>();

function RatingStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );
}

type ReviewsPageProps = {
  reviews: LaravelPaginator<Review>;
};

export function ReviewsPage({ reviews }: ReviewsPageProps) {
  const { hasAbility, user } = useAuth();
  const canManage = hasAbility('reviews.manage');
  const canCreate = canManage || hasAbility('reviews.create');
  const { data, pagination, pageCount, setPagination, reload, isFetching } =
    useInertiaPagination(reviews, ['reviews']);
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [rowSelection, setRowSelection] = React.useState({});
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Review | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedForEdit, setSelectedForEdit] = React.useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const openCreate = React.useCallback(() => {
    setFormMode('create');
    setSelectedForEdit(null);
    setFormOpen(true);
  }, []);

  const openEdit = React.useCallback((review: Review) => {
    setFormMode('edit');
    setSelectedForEdit(review);
    setFormOpen(true);
  }, []);

  const openDelete = React.useCallback((review: Review) => {
    setSelectedForDelete(review);
    setDeleteOpen(true);
  }, []);

  const columns = React.useMemo(
    () => [
      createDataTableSelectionColumn<Review>(),
      columnHelper.accessor('name', {
        header: 'Reviewer',
        cell: ({ row }) => (
          <div className="min-w-[160px]">
            <p className="font-medium">{row.original.name}</p>
            <p className="text-sm text-muted-foreground">{row.original.email}</p>
          </div>
        ),
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ getValue }) => getValue() ?? '—',
      }),
      columnHelper.accessor('rating', {
        header: 'Rating',
        cell: ({ getValue }) => <RatingStars rating={getValue()} />,
      }),
      columnHelper.accessor('body', {
        header: 'Review',
        cell: ({ getValue }) => (
          <p className="max-w-xs truncate text-sm">{getValue()}</p>
        ),
      }),
      ...(canManage
        ? [
            columnHelper.accessor('is_visible', {
              header: 'Visible',
              cell: ({ getValue }) => (
                <Badge variant={getValue() ? 'default' : 'secondary'}>
                  {getValue() ? 'Visible' : 'Hidden'}
                </Badge>
              ),
            }),
          ]
        : []),
      createDataTableActionsColumn<Review>({
        cell: ({ row }) => (
          <DataTableRowActionsMenu label={`Actions for ${row.original.name}`}>
            <TableDropdownAction
              icon={Eye}
              onClick={() => {
                setSelected(row.original);
                setDetailOpen(true);
              }}
            >
              View
            </TableDropdownAction>
            {canManage ? (
              <>
                <TableDropdownAction
                  icon={Pencil}
                  onClick={() => openEdit(row.original)}
                >
                  Edit
                </TableDropdownAction>
                <TableDropdownAction
                  icon={EyeOff}
                  onClick={() => {
                    router.patch(`/reviews/${row.original.id}/toggle-visibility`, {}, {
                      preserveScroll: true,
                      only: ['reviews'],
                      onSuccess: () => showMutationSuccess('Visibility updated'),
                      onError: () => showMutationError(null, 'Failed to update visibility'),
                    });
                  }}
                >
                  {row.original.is_visible ? 'Hide' : 'Show'}
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
    [canManage, openDelete, openEdit],
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
        <PageTitle title="Reviews" description="Customer reviews" icon={Star} />
        {canCreate ? (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={table.getAllColumns().length}
        bodyProps={{ emptyMessage: 'No reviews yet.' }}
        toolbar={
          <DataTableToolbar
            start={
              <Input
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search reviews..."
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
      <ReviewDetailDialog
        open={detailOpen}
        onOpenChange={setDetailOpen}
        review={selected}
      />
      {canCreate ? (
        <ReviewFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          review={selectedForEdit}
          isSubmitting={isSubmitting}
          defaultValues={
            !canManage && formMode === 'create'
              ? { name: user?.name ?? '', email: user?.email ?? '' }
              : undefined
          }
          lockName={!canManage && formMode === 'create'}
          lockEmail={!canManage && formMode === 'create'}
          onSubmit={async (values: ReviewFormValues) => {
            setIsSubmitting(true);

            if (formMode === 'create') {
              router.post('/reviews', serializeReviewFormPayload(values, 'create'), {
                preserveScroll: true,
                only: ['reviews'],
                onSuccess: () => {
                  showMutationSuccess('Review created');
                  setFormOpen(false);
                },
                onError: (errors) => {
                  const message =
                    messageFromLaravelResponseBody({ errors }) ??
                    'Failed to create review';
                  toast.error(message);
                },
                onFinish: () => setIsSubmitting(false),
              });
              return;
            }

            if (!canManage || !selectedForEdit) {
              setIsSubmitting(false);
              return;
            }

            router.patch(
              `/reviews/${selectedForEdit.id}`,
              serializeReviewFormPayload(values, 'edit'),
              {
                preserveScroll: true,
                only: ['reviews'],
                onSuccess: () => {
                  showMutationSuccess('Review updated');
                  setFormOpen(false);
                  setSelectedForEdit(null);
                },
                onError: (errors) => {
                  const message =
                    messageFromLaravelResponseBody({ errors }) ??
                    'Failed to update review';
                  toast.error(message);
                },
                onFinish: () => setIsSubmitting(false),
              },
            );
          }}
        />
      ) : null}
      {canManage ? (
        <DeleteReviewDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            review={selectedForDelete}
            isDeleting={isDeleting}
            onConfirm={async () => {
              if (!selectedForDelete) return;
              setIsDeleting(true);
              router.delete(`/reviews/${selectedForDelete.id}`, {
                preserveScroll: true,
                only: ['reviews'],
                onSuccess: () => {
                  showMutationSuccess('Review deleted');
                  setDeleteOpen(false);
                  setSelectedForDelete(null);
                },
                onError: () => showMutationError(null, 'Failed to delete review'),
                onFinish: () => setIsDeleting(false),
              });
            }}
          />
      ) : null}
    </div>
  );
}
