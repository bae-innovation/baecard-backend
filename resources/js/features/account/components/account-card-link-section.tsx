import { Copy, ExternalLink, Link2, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

import { FormSection } from '@/components/shared/form-section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AccountCardCode } from '@/features/account/schemas/account.schema';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { cn } from '@/lib/utils';

type AccountCardLinkSectionProps = {
  cardCode: AccountCardCode | null;
};

function CardStatusBadge({ status }: { status: string }) {
  const isPublished = status === 'published';

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium capitalize',
        isPublished
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
          : 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300',
      )}
    >
      {status}
    </Badge>
  );
}

export function AccountCardLinkSection({ cardCode }: AccountCardLinkSectionProps) {
  const { copy, isCopied } = useCopyToClipboardWithStatus();

  if (!cardCode) {
    return (
      <FormSection
        title="Card link & QR code"
        description="Your personal scan link and QR code appear here once a card is assigned to your account."
      >
        <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-8 text-center">
          <QrCode className="mx-auto mb-3 size-10 text-muted-foreground" />
          <p className="text-sm font-medium">No card linked yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Register with a card code or ask your administrator to assign one to you.
          </p>
        </div>
      </FormSection>
    );
  }

  const publicUrl = cardCode.profile_url ?? cardCode.scan_url;

  return (
    <FormSection
      title="Card link & QR code"
      description="Share your QR code or public link so people can open your card profile."
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col items-center gap-4 rounded-xl border bg-white p-5 text-center shadow-sm dark:bg-background">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <QrCode className="size-4" />
            Scan QR code
          </div>
          <QRCode value={cardCode.scan_url} size={200} />
          <p className="font-mono text-sm font-semibold">{cardCode.code}</p>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Card status</span>
            <CardStatusBadge status={cardCode.status} />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Public URL
            </p>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="block break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              {publicUrl}
            </a>
            {!cardCode.profile_url ? (
              <p className="text-sm text-muted-foreground">
                Your live public profile link will appear here once your card is published.
                Until then, use the scan link below for activation and setup.
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Scan URL
            </p>
            <p className="break-all text-sm text-foreground">{cardCode.scan_url}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => copy(publicUrl)}
            >
              <Copy className="mr-2 size-4" />
              {isCopied ? 'Copied' : 'Copy public link'}
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={() => copy(cardCode.scan_url)}>
              <Link2 className="mr-2 size-4" />
              Copy scan link
            </Button>
            <Button type="button" variant="outline" size="sm" asChild>
              <a href={publicUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 size-4" />
                Open public link
              </a>
            </Button>
          </div>
        </div>
      </div>
    </FormSection>
  );
}
