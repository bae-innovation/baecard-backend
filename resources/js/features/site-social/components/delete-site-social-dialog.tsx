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
import type { SiteSocialLink } from '@/features/site-social/schemas/site-social.schema';
import { PLATFORM_LABELS } from '@/features/site-social/schemas/site-social.schema';

type DeleteSiteSocialDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteSocialLink: SiteSocialLink | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
};

export function DeleteSiteSocialDialog({
  open,
  onOpenChange,
  siteSocialLink,
  onConfirm,
  isDeleting = false,
}: DeleteSiteSocialDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete social link</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-medium text-foreground">
              {siteSocialLink ? PLATFORM_LABELS[siteSocialLink.platform] : 'this link'}
            </span>
            ? This action cannot be undone.
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
              'Delete link'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
