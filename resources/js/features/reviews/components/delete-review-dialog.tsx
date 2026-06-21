import { Loader2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import type { Review } from '@/features/reviews/schemas/review.schema';

type DeleteReviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
};

export function DeleteReviewDialog({
  open,
  onOpenChange,
  review,
  onConfirm,
  isDeleting = false,
}: DeleteReviewDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the review from{' '}
            <span className="font-medium text-foreground">{review?.name}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={() => void onConfirm()}
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete review'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
