import { router } from '@inertiajs/react';
import { Loader2, UserRoundPlus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CardCodeUserSearchPicker } from '@/features/cards/components/card-code-user-search-picker';
import type { CardCode } from '@/features/cards/schemas/card-code.schema';
import type { CardCodeAssignableUser } from '@/features/cards/schemas/card-code.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type CardCodeAssignUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardCode: CardCode | null;
};

export function CardCodeAssignUserDialog({
  open,
  onOpenChange,
  cardCode,
}: CardCodeAssignUserDialogProps) {
  const [selectedUser, setSelectedUser] =
    React.useState<CardCodeAssignableUser | null>(null);
  const [isAssigning, setIsAssigning] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setSelectedUser(null);
      setIsAssigning(false);
    }
  }, [open]);

  const handleAssign = () => {
    if (!cardCode || !selectedUser) return;

    setIsAssigning(true);
    router.patch(
      `/cards/${cardCode.id}/assign-user`,
      { user_id: selectedUser.id },
      {
        preserveScroll: true,
        only: ['codes'],
        onSuccess: () => {
          showMutationSuccess('User assigned to card code');
          onOpenChange(false);
        },
        onError: () =>
          showMutationError(null, 'Failed to assign user to card code'),
        onFinish: () => setIsAssigning(false),
      },
    );
  };

  const alreadyAssigned =
    cardCode?.status === 'published' && cardCode.user_id != null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign user</DialogTitle>
          <DialogDescription>
            {cardCode ? (
              <>
                Link a customer account to card code{' '}
                <span className="font-mono font-medium text-foreground">
                  {cardCode.code}
                </span>
                .
              </>
            ) : (
              'Search for a customer by email or phone, then assign them to this card.'
            )}
          </DialogDescription>
        </DialogHeader>

        {alreadyAssigned && cardCode.user ? (
          <div className="rounded-lg border bg-muted/30 p-4 text-sm">
            <p className="font-medium text-foreground">Currently assigned</p>
            <p className="mt-1">{cardCode.user.name}</p>
            <p className="text-muted-foreground">{cardCode.user.email}</p>
            {cardCode.user.phone ? (
              <p className="text-muted-foreground">{cardCode.user.phone}</p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              This card is already published. Assign another user only if you
              need to replace the linked account.
            </p>
          </div>
        ) : null}

        <CardCodeUserSearchPicker
          selectedUser={selectedUser}
          onSelect={setSelectedUser}
          disabled={isAssigning}
          highlightUserId={cardCode?.user_id ?? null}
          emailInputId="assign-email"
          phoneInputId="assign-phone"
        />

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isAssigning}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAssign}
            disabled={!selectedUser || isAssigning}
          >
            {isAssigning ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <UserRoundPlus className="size-4" />
                Assign user
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
