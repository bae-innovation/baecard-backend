import { AlertCircle } from 'lucide-react';
import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ApiErrorModalContext,
  type ApiErrorModalContextValue,
} from '@/lib/api-error-modal-context';

type ApiErrorModalProviderProps = {
  children: ReactNode;
};

export function ApiErrorModalProvider({
  children,
}: ApiErrorModalProviderProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const show = useCallback((msg: string) => {
    setMessage((msg ?? '').trim() || 'Something went wrong');
    setOpen(true);
  }, []);

  function close() {
    setOpen(false);
    setMessage('');
  }

  const value: ApiErrorModalContextValue = useMemo(() => ({ show }), [show]);

  return (
    <ApiErrorModalContext.Provider value={value}>
      {children}
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) close();
        }}
      >
        <DialogContent
          className="z-[200] max-w-sm gap-0 border-0 bg-transparent p-0 shadow-none [&>button:last-child]:hidden"
          aria-describedby="api-error-description"
        >
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-6 pb-4">
              <div
                className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-destructive/10"
                aria-hidden
              >
                <AlertCircle className="size-5 text-destructive" />
              </div>
              <div className="min-w-0 flex-1 space-y-1 text-left">
                <DialogTitle className="text-base font-semibold leading-tight">
                  Request Failed
                </DialogTitle>
                <DialogDescription
                  id="api-error-description"
                  className="text-sm leading-snug text-muted-foreground"
                >
                  {message}
                </DialogDescription>
              </div>
            </CardHeader>
            <CardFooter className="justify-end border-t bg-muted/30 px-6 py-3">
              <Button type="button" variant="outline" size="sm" onClick={close}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </ApiErrorModalContext.Provider>
  );
}
