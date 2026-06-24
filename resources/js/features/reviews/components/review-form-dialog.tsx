import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ReviewForm } from '@/features/reviews/components/review-form';
import type { Review, ReviewFormValues } from '@/features/reviews/schemas/review.schema';

type ReviewFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  review?: Review | null;
  onSubmit: (values: ReviewFormValues) => Promise<void>;
  isSubmitting?: boolean;
  defaultValues?: Partial<ReviewFormValues>;
  lockName?: boolean;
  lockEmail?: boolean;
};

export function ReviewFormDialog({
  open,
  onOpenChange,
  mode,
  review,
  onSubmit,
  isSubmitting = false,
  defaultValues,
  lockName = false,
  lockEmail = false,
}: ReviewFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add review' : 'Edit review'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Create a new customer review.'
              : `Update the review from ${review?.name ?? 'this customer'}.`}
          </DialogDescription>
        </DialogHeader>

        <ReviewForm
          key={mode === 'edit' && review ? review.id : 'create'}
          mode={mode}
          variant="dialog"
          review={review}
          isSubmitting={isSubmitting}
          defaultValues={defaultValues}
          lockName={lockName}
          lockEmail={lockEmail}
          onCancel={() => onOpenChange(false)}
          onSubmit={onSubmit}
          submitLabel={mode === 'create' ? 'Create review' : 'Save changes'}
        />
      </DialogContent>
    </Dialog>
  );
}
