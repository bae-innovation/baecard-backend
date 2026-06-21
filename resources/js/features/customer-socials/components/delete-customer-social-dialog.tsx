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
import type { CustomerSocial } from '@/features/customer-socials/schemas/customer-social.schema';

type DeleteCustomerSocialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  social: CustomerSocial | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
};

export function DeleteCustomerSocialDialog({
  open,
  onOpenChange,
  social,
  onConfirm,
  isDeleting = false,
}: DeleteCustomerSocialDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete social link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this{' '}
            <span className="font-medium text-foreground">{social?.platform}</span> link?
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
              'Delete link'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
