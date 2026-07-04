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
import type { OfferTicker } from '@/features/offer-tickers/schemas/offer-ticker.schema';

type DeleteOfferTickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offerTicker: OfferTicker | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
};

export function DeleteOfferTickerDialog({
  open,
  onOpenChange,
  offerTicker,
  onConfirm,
  isDeleting = false,
}: DeleteOfferTickerDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete offer ticker</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">{offerTicker?.message.en}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button variant="destructive" disabled={isDeleting} onClick={() => void onConfirm()}>
            {isDeleting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete ticker'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
