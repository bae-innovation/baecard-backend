import { router } from '@inertiajs/react';
import { Pencil, Plus, Star, Trash2 } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { DeleteReviewDialog } from '@/features/reviews/components/delete-review-dialog';
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
import { OwnerAppEmptyState } from '@/owner/components/owner-app-empty-state';
import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';
import { OwnerAppPagination } from '@/owner/components/owner-app-pagination';
import { OwnerAppSearchRow } from '@/owner/components/owner-app-search-row';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';
import type { LaravelPaginator } from '@/types/inertia';

function RatingStars({ rating, size = 'md' }: { rating: number; size?: 'sm' | 'md' }) {
  const starClass = size === 'sm' ? 'size-3.5' : 'size-4';

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            starClass,
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/40',
          )}
        />
      ))}
    </div>
  );
}

function formatDate(value: string | undefined) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

type ReviewsAppPageProps = {
  reviews: LaravelPaginator<Review>;
};

export function ReviewsAppPage({ reviews }: ReviewsAppPageProps) {
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
  const canCreate = canCreateReviews() || canCreateOwnReviews();
  const canUpdateStaff = canUpdateReviews();
  const canDeleteStaff = canDeleteReviews();
  const canUpdateOwn = canUpdateOwnReviews();
  const canDeleteOwn = canDeleteOwnReviews();
  const isPortalCustomer =
    canCreateOwnReviews() && !canCreateReviews() && !isStaff;

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

  const { data, pagination, reload, isFetching } = useInertiaPagination(reviews, ['reviews']);
  const [search, setSearch] = React.useState('');
  const [selected, setSelected] = React.useState<Review | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selectedForEdit, setSelectedForEdit] = React.useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<Review | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return data;

    return data.filter((item) => {
      const haystack = [item.name, item.email, item.title, item.body]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [data, search]);

  const openCreate = () => {
    setFormMode('create');
    setSelectedForEdit(null);
    setFormOpen(true);
  };

  const openEdit = (review: Review) => {
    setFormMode('edit');
    setSelectedForEdit(review);
    setFormOpen(true);
  };

  const openDetail = (review: Review) => {
    setSelected(review);
    setDetailOpen(true);
  };

  const openDelete = (review: Review) => {
    setSelectedForDelete(review);
    setDeleteOpen(true);
  };

  const handlePageChange = (page: number) => {
    router.get(
      window.location.pathname,
      { page, per_page: pagination.pageSize },
      { preserveState: true, preserveScroll: true, only: ['reviews'] },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <OwnerAppPageHeader
        title={isStaff ? 'Reviews' : 'My reviews'}
        description={
          isStaff ? 'Customer reviews on your site' : 'Reviews you have submitted'
        }
        icon={Star}
        action={
          canCreate ? (
            <Button type="button" size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 size-4" />
              Add
            </Button>
          ) : null
        }
      />

      <OwnerAppSearchRow
        value={search}
        onChange={setSearch}
        placeholder="Search reviews…"
        onRefresh={reload}
        isRefreshing={isFetching}
      />

      {filtered.length === 0 ? (
        <OwnerAppEmptyState
          icon={Star}
          title={search ? 'No matches' : 'No reviews yet'}
          description={
            search
              ? 'Try a different search term.'
              : canCreate
                ? 'Share your experience with a new review.'
                : 'No reviews found.'
          }
          action={
            canCreate && !search ? (
              <Button type="button" size="sm" onClick={openCreate}>
                <Plus className="mr-1.5 size-4" />
                Add review
              </Button>
            ) : null
          }
        />
      ) : (
        <ul className="space-y-3">
          {filtered.map((review) => (
            <li key={review.id}>
              <article
                className="rounded-xl border bg-card p-4 shadow-sm transition-colors active:bg-muted/40"
                role="button"
                tabIndex={0}
                onClick={() => openDetail(review)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openDetail(review);
                  }
                }}
              >
                <div className="flex gap-3">
                  {review.image_url ? (
                    <img
                      src={review.image_url}
                      alt=""
                      className="size-12 shrink-0 rounded-lg border object-cover"
                    />
                  ) : (
                    <div
                      className="flex size-12 shrink-0 items-center justify-center rounded-lg border bg-muted/40"
                      aria-hidden
                    >
                      <Star className="size-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">
                          {review.title ?? 'Review'}
                        </p>
                        <p className="text-sm text-muted-foreground">{review.name}</p>
                      </div>
                      {isStaff ? (
                        <Badge
                          variant={review.is_visible ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {review.is_visible ? 'Visible' : 'Hidden'}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-2">
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {review.body}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatDate(review.created_at)}
                    </p>
                  </div>
                </div>

                {(canUpdateReview(review) || canDeleteReview(review)) && (
                  <div
                    className="mt-3 flex gap-2 border-t pt-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {canUpdateReview(review) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => openEdit(review)}
                      >
                        <Pencil className="mr-1.5 size-4" />
                        Edit
                      </Button>
                    ) : null}
                    {canDeleteReview(review) ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className={cn(
                          'text-destructive hover:text-destructive',
                          canUpdateReview(review) ? 'flex-1' : 'w-full',
                        )}
                        onClick={() => openDelete(review)}
                      >
                        <Trash2 className="mr-1.5 size-4" />
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

      <OwnerAppPagination paginator={reviews} onPageChange={handlePageChange} />

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent side="bottom" className="max-h-[85dvh] rounded-t-2xl px-4 pb-6">
          <SheetHeader className="text-left">
            <SheetTitle>{selected?.title ?? 'Review'}</SheetTitle>
          </SheetHeader>
          {selected ? (
            <div className="mt-4 space-y-3 text-sm">
              {selected.image_url ? (
                <img
                  src={selected.image_url}
                  alt=""
                  className="mx-auto max-h-40 rounded-xl border object-cover"
                />
              ) : null}
              <RatingStars rating={selected.rating} />
              <p>
                <span className="font-medium text-foreground">By:</span> {selected.name}
              </p>
              <p>
                <span className="font-medium text-foreground">Email:</span> {selected.email}
              </p>
              <p>
                <span className="font-medium text-foreground">Date:</span>{' '}
                {formatDate(selected.created_at)}
              </p>
              {isStaff ? (
                <p>
                  <span className="font-medium text-foreground">Visible:</span>{' '}
                  {selected.is_visible ? 'Yes' : 'No'}
                </p>
              ) : null}
              <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3">{selected.body}</p>
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

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
                      messageFromLaravelResponseBody({ errors }) ?? 'Failed to create review';
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
                    messageFromLaravelResponseBody({ errors }) ?? 'Failed to update review';
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
                setDetailOpen(false);
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
