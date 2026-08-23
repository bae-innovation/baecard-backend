import { Share2, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type IosInstallSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function IosInstallSheet({ open, onOpenChange }: IosInstallSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add BAE Card to your home screen</DialogTitle>
          <DialogDescription>
            On iPhone, install the app from Safari using these steps:
          </DialogDescription>
        </DialogHeader>
        <ol className="space-y-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <Share2 className="mt-0.5 size-4 shrink-0 text-primary" />
            <span>Tap the <strong className="text-foreground">Share</strong> button in Safari.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-4 shrink-0 items-center justify-center text-xs font-bold text-primary">
              +
            </span>
            <span>
              Choose <strong className="text-foreground">Add to Home Screen</strong>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="flex size-4 shrink-0 items-center justify-center text-xs font-bold text-primary">
              ✓
            </span>
            <span>Open BAE Card from your home screen like any other app.</span>
          </li>
        </ol>
        <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          <X className="mr-2 size-4" />
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
