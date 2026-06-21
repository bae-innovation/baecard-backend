import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomerSocialsPanel } from '@/features/customer-socials/components/customer-socials-panel';

type CustomerSocialsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerId: number;
  customerName?: string;
};

export function CustomerSocialsDialog({
  open,
  onOpenChange,
  customerId,
  customerName,
}: CustomerSocialsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Social Links{customerName ? ` — ${customerName}` : ''}
          </DialogTitle>
        </DialogHeader>
        <CustomerSocialsPanel customerId={customerId} />
      </DialogContent>
    </Dialog>
  );
}
