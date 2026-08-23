import { Download, MonitorSmartphone, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type InstallHelpSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InstallHelpSheet({ open, onOpenChange }: InstallHelpSheetProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Install BAE Card</DialogTitle>
          <DialogDescription>
            Add BAE Card to your device for a full-screen app experience.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div className="flex gap-3">
            <MonitorSmartphone className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              In <strong className="text-foreground">Chrome</strong> or{' '}
              <strong className="text-foreground">Edge</strong>, open the browser menu and choose{' '}
              <strong className="text-foreground">Install app</strong> or{' '}
              <strong className="text-foreground">Install BAE Card</strong>. You may also see an
              install icon in the address bar.
            </p>
          </div>
          <div className="flex gap-3">
            <Download className="mt-0.5 size-4 shrink-0 text-primary" />
            <p>
              After installing, open BAE Card from your home screen or app list. Sign in once with{' '}
              <strong className="text-foreground">Remember me</strong> to stay logged in.
            </p>
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          <X className="mr-2 size-4" />
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
