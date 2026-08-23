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
import { objectToFormData } from '@/lib/object-to-form-data';
import { useOwnerAppShell } from '@/owner/hooks/use-owner-app-shell';
import { ReviewsAppPage } from '@/owner/pages/reviews-app-page';
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
  const isOwnerApp = useOwnerAppShell();

  if (isOwnerApp) {
    return <ReviewsAppPage reviews={reviews} />;
  }

  return <ReviewsTablePage reviews={reviews} />;
}

function ReviewsTablePage({ reviews }: ReviewsPageProps) {
  const {
    user,
    canViewReviews,
    canViewOwnReviews,
    canCreateReviews,
    canUpdateReviews,
    canDeleteReviews,
    canCreateOwnReviews,
    canUpdateOwnReviews,
    canDeleteOwnReviews,
  } = useAuth();
  const isStaff = canViewReviews();
  const canView = isStaff || canViewOwnReviews();
  const canCreate = canCreateReviews() || canCreateOwnReviews();
  const canUpdateStaff = canUpdateReviews();
  const canDeleteStaff = canDeleteReviews();
  const canUpdateOwn = canUpdateOwnReviews();
  const canDeleteOwn = canDeleteOwnReviews();
  const isPortalCustomer =
    canCreateOwnReviews() && !canCreateReviews() && !isStaff;
  const showActionsColumn =
    canView || canUpdateStaff || canDeleteStaff || canUpdateOwn || canDeleteOwn;

  const canUpdateReview = React.useCallback(
    (review: Review) =>
      canUpdateStaff ||
      (canUpdateOwn && review.created_by != null && review.created_by === user?.id),
    [canUpdateOwn, canUpdateStaff, user?.id],
  );

  const canDeleteReview = React.useCallback(
    (review: Review) =>
      canDeleteStaff ||
      (canDeleteOwn && review.created_by != null && review.created_by === user?.id),
    [canDeleteOwn, canDeleteStaff, user?.id],
  );

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

  const columns = React.useMemo(() => {
    const baseColumns = [
      ...(canDeleteStaff || canDeleteOwn ? [createDataTableSelectionColumn<Review>()] : []),
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
      ...(isStaff
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
    ];

    if (!showActionsColumn) {
      return baseColumns;
    }

    return [
      ...baseColumns,
      createDataTableActionsColumn<Review>({
        cell: ({ row }) => {
          const menuItems: React.ReactNode[] = [];

          if (canView) {
            menuItems.push(
              <TableDropdownAction
                key="view"
                icon={Eye}
                onClick={() => {
                  setSelected(row.original);
                  setDetailOpen(true);
                }}
              >
                View
              </TableDropdownAction>,
            );
          }

          if (canUpdateReview(row.original)) {
            menuItems.push(
              <TableDropdownAction
                key="edit"
                icon={Pencil}
                onClick={() => openEdit(row.original)}
              >
                Edit
              </TableDropdownAction>,
            );
          }

          if (canUpdateStaff) {
            menuItems.push(
              <TableDropdownAction
                key="toggle-visibility"
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
              </TableDropdownAction>,
            );
          }

          if (canDeleteReview(row.original)) {
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
  }, [
    canDeleteReview,
    canUpdateReview,
    canUpdateStaff,
    canView,
    isStaff,
    openDelete,
    openEdit,
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
    enableRowSelection: canDeleteStaff || canDeleteOwn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <PageTitle
          title={isStaff ? 'Reviews' : 'My Reviews'}
          description={
            isStaff ? 'Customer reviews' : 'Reviews you have submitted'
          }
          icon={Star}
        />
        {canCreate ? (
          <Button type="button" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        ) : null}
      </div>
      <DataTableLayout
        table={table}
        colSpan={columns.length}
        bodyProps={{
          emptyMessage: canCreate
            ? 'No reviews yet. Add the first review to get started.'
            : 'No reviews found.',
        }}
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
      {canView ? (
        <ReviewDetailDialog
          open={detailOpen}
          onOpenChange={setDetailOpen}
          review={selected}
        />
      ) : null}
      {canCreate || canUpdateStaff || canUpdateOwn ? (
        <ReviewFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          mode={formMode}
          review={selectedForEdit}
          isSubmitting={isSubmitting}
          defaultValues={
            isPortalCustomer && formMode === 'create'
              ? { name: user?.name ?? '', email: user?.email ?? '' }
              : undefined
          }
          lockName={isPortalCustomer && formMode === 'create'}
          lockEmail={isPortalCustomer && formMode === 'create'}
          onSubmit={async (values: ReviewFormValues, image?: File | null) => {
            setIsSubmitting(true);

            if (formMode === 'create') {
              router.post(
                '/reviews',
                objectToFormData(serializeReviewFormPayload(values, 'create'), {
                  image: image ?? undefined,
                }),
                {
                  preserveScroll: true,
                  only: ['reviews'],
                  forceFormData: true,
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
                },
              );
              return;
            }

            if (!selectedForEdit || !canUpdateReview(selectedForEdit)) {
              setIsSubmitting(false);
              return;
            }

            router.post(
              `/reviews/${selectedForEdit.id}`,
              objectToFormData(
                serializeReviewFormPayload(values, 'edit'),
                { image: image ?? undefined },
                'PATCH',
              ),
              {
                preserveScroll: true,
                only: ['reviews'],
                forceFormData: true,
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
      {canDeleteStaff || canDeleteOwn ? (
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
