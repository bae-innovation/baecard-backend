import type { ReactNode } from 'react';
import { ExternalLink, QrCode, UserRound } from 'lucide-react';
import * as React from 'react';
import QRCode from 'react-qr-code';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { CardCode } from '@/features/cards/schemas/card-code.schema';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { cn } from '@/lib/utils';

type CardCodeDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cardCode: CardCode | null;
};

function formatDate(value?: string | null) {
  if (!value) return '—';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function DetailField({
  label,
  value,
  mono,
  className,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  className?: string;
}) {
  const empty = value == null || value === '' || value === '—';

  return (
    <div className={cn('space-y-1', className)}>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd
        className={cn(
          'text-sm leading-relaxed break-all',
          mono && 'font-mono text-[13px]',
          empty && 'text-muted-foreground',
        )}
      >
        {empty ? '—' : value}
      </dd>
    </div>
  );
}

function DetailSection({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border bg-card p-4', className)}>
      <h3 className="mb-3 text-sm font-semibold tracking-tight">{title}</h3>
      <dl className="grid gap-4 sm:grid-cols-2">{children}</dl>
    </section>
  );
}

function WorkflowBadge({ card }: { card: CardCode }) {
  if (card.status === 'published') {
    return <Badge variant="default">Verified</Badge>;
  }

  if (card.user_id != null) {
    return <Badge variant="secondary">Awaiting verification</Badge>;
  }

  return <Badge variant="outline">Unassigned</Badge>;
}

export function CardCodeDetailDialog({
  open,
  onOpenChange,
  cardCode,
}: CardCodeDetailDialogProps) {
  const { copy, isCopied } = useCopyToClipboardWithStatus();

  if (!cardCode) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl" />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 overflow-hidden p-0">
        <div className="shrink-0 border-b bg-muted/20 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 space-y-2">
                <DialogTitle className="font-mono text-xl tracking-wide">
                  {cardCode.code}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {cardCode.name}
                  {cardCode.phone ? ` · ${cardCode.phone}` : ''}
                </DialogDescription>
              </div>
              <WorkflowBadge card={cardCode} />
            </div>
          </DialogHeader>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6">
          <div className="space-y-4">
            <DetailSection title="Card code">
              <DetailField label="ID" value={`#${cardCode.id}`} mono />
              <DetailField label="Code" value={cardCode.code} mono />
              <DetailField label="Recipient name" value={cardCode.name} />
              <DetailField label="Mobile" value={cardCode.phone ?? '—'} />
              <DetailField
                label="Status"
                value={<WorkflowBadge card={cardCode} />}
              />
              <DetailField
                label="Linked account"
                value={
                  cardCode.user_id
                    ? `User #${cardCode.user_id}`
                    : 'Not linked yet'
                }
                mono={Boolean(cardCode.user_id)}
              />
            </DetailSection>

            <DetailSection title="Links">
              <DetailField
                label="Scan URL"
                value={
                  <a
                    href={cardCode.scan_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    {cardCode.scan_url}
                  </a>
                }
                className="sm:col-span-2"
              />
              <DetailField
                label="Profile URL"
                value={
                  cardCode.profile_url ? (
                    <a
                      href={cardCode.profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline-offset-4 hover:underline"
                    >
                      {cardCode.profile_url}
                    </a>
                  ) : (
                    '—'
                  )
                }
                className="sm:col-span-2"
              />
              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copy(cardCode.scan_url)}
                >
                  {isCopied ? 'Copied scan link' : 'Copy scan link'}
                </Button>
                <Button type="button" variant="outline" size="sm" asChild>
                  <a
                    href={cardCode.scan_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Open scan link
                  </a>
                </Button>
                {cardCode.profile_url ? (
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a
                      href={cardCode.profile_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center"
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Open profile
                    </a>
                  </Button>
                ) : null}
              </div>
            </DetailSection>

            {cardCode.user ? (
              <DetailSection title="Linked user">
                <DetailField label="User ID" value={`#${cardCode.user.id}`} mono />
                <DetailField label="Name" value={cardCode.user.name} />
                <DetailField label="Email" value={cardCode.user.email ?? '—'} />
                <DetailField
                  label="Phone"
                  value={cardCode.user.phone ?? '—'}
                />
              </DetailSection>
            ) : null}

            <section className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <QrCode className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold tracking-tight">
                  QR code
                </h3>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
                <div className="rounded-xl border bg-white p-4">
                  <QRCode value={cardCode.scan_url} size={160} />
                </div>
                <p className="max-w-xs text-sm text-muted-foreground">
                  Scan to open the card claim link for code{' '}
                  <span className="font-mono font-medium text-foreground">
                    {cardCode.code}
                  </span>
                  .
                </p>
              </div>
            </section>

            <section className="rounded-lg border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <UserRound className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold tracking-tight">Record</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField
                  label="Created"
                  value={formatDate(cardCode.created_at)}
                />
                <DetailField
                  label="Last updated"
                  value={formatDate(cardCode.updated_at)}
                />
              </div>
              <Separator className="my-4" />
              <p className="text-xs text-muted-foreground">
                Internal reference: card code #{cardCode.id}
              </p>
            </section>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-muted/10 px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
