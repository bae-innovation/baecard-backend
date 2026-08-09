import type { ComponentType, ReactNode } from 'react';
import { Loader2, Mail, Phone, UserRound } from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { fetchCustomerDetails } from '@/features/customers/api/customers.api';
import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import type { Customer } from '@/features/customers/schemas/customer.schema';
import { cn } from '@/lib/utils';

type CustomerDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
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
          'text-sm leading-relaxed',
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

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold leading-snug">{value}</p>
    </div>
  );
}

function SocialLinkItem({ social }: { social: ProfileSocialLink & { platform: string } }) {
  const href = social.url?.trim() || undefined;

  return (
    <div className="flex items-start justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0 space-y-1">
        <Badge variant="outline">{social.platform}</Badge>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="block truncate text-xs text-primary hover:underline"
          >
            {href}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function CustomerDetailDialog({
  open,
  onOpenChange,
  customer,
}: CustomerDetailDialogProps) {
  const [details, setDetails] = React.useState<{
    customer: Customer;
    profile?: {
      social_links?: ProfileSocialLink[];
    } | null;
    orders: Array<{
      id: number;
      order_number: string;
      source?: 'website' | 'custom';
      product_name: string;
      status: string;
      created_at?: string;
      card_code?: {
        id: number;
        code: string;
        status: 'pending' | 'published';
        scan_url?: string;
      } | null;
      cardCode?: {
        id: number;
        code: string;
        status: 'pending' | 'published';
        scan_url?: string;
      } | null;
    }>;
  } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open || !customer) {
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);
    setDetails(null);

    fetchCustomerDetails(customer.id)
      .then((data) => {
        if (!cancelled) {
          setDetails(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load customer details.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, customer]);

  const displayCustomer = details?.customer ?? customer;
  const socials = details?.profile?.social_links ?? [];
  const orders = details?.orders ?? [];

  if (!displayCustomer) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl" />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="shrink-0 border-b bg-muted/20 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-4 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm sm:h-32 sm:w-32">
                <UserRound className="h-10 w-10 text-muted-foreground/50" />
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <DialogTitle className="text-xl leading-tight sm:text-2xl">
                    {displayCustomer.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 text-sm">
                    {displayCustomer.email}
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  {displayCustomer.email_verified_at ? (
                    <Badge variant="secondary">Verified</Badge>
                  ) : (
                    <Badge variant="outline">Pending verification</Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard
              label="Email"
              value={displayCustomer.email}
              icon={Mail}
            />
            <StatCard
              label="Phone"
              value={displayCustomer.phone ?? '—'}
              icon={Phone}
            />
            <StatCard
              label="Social Links"
              value={socials.length}
              icon={UserRound}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-4 p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading customer details...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {!isLoading && !error ? (
              <>
                <DetailSection title="Profile">
                  <DetailField
                    label="Customer ID"
                    value={`#${displayCustomer.id}`}
                    mono
                  />
                  <DetailField label="Name" value={displayCustomer.name} />
                  <DetailField label="Email" value={displayCustomer.email} />
                  <DetailField
                    label="Phone"
                    value={displayCustomer.phone ?? '—'}
                  />
                  <DetailField
                    label="Email Verified"
                    value={
                      displayCustomer.email_verified_at
                        ? formatDate(displayCustomer.email_verified_at)
                        : 'Not verified'
                    }
                  />
                </DetailSection>

                <section className="rounded-lg border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold tracking-tight">
                    Orders &amp; Cards
                  </h3>
                  {orders.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No orders yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => {
                        const linkedCard = order.cardCode ?? order.card_code;

                        return (
                          <div key={order.id} className="rounded-lg border p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <p className="font-medium">{order.order_number}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.product_name}
                                </p>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {order.source ? (
                                  <Badge variant="outline">{order.source}</Badge>
                                ) : null}
                                <Badge variant="secondary">{order.status}</Badge>
                              </div>
                            </div>
                            {linkedCard ? (
                              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Card:</span>
                                <Badge variant="outline" className="font-mono">
                                  {linkedCard.code}
                                </Badge>
                                <Badge variant="secondary">{linkedCard.status}</Badge>
                                {linkedCard.scan_url ? (
                                  <a
                                    href={linkedCard.scan_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                  >
                                    Open scan link
                                  </a>
                                ) : null}
                              </div>
                            ) : (
                              <p className="mt-2 text-xs text-muted-foreground">
                                No card linked to this order yet.
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>

                <section className="rounded-lg border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold tracking-tight">
                    Social Links
                  </h3>
                  {socials.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No social links added yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {socials.map((social, index) => (
                        <SocialLinkItem key={`${social.platform}-${index}`} social={social} />
                      ))}
                    </div>
                  )}
                </section>

                <section className="rounded-lg border bg-card p-4">
                  <h3 className="mb-3 text-sm font-semibold tracking-tight">
                    Record
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailField
                      label="Joined"
                      value={formatDate(displayCustomer.created_at)}
                    />
                    <DetailField
                      label="Last Updated"
                      value={formatDate(displayCustomer.updated_at)}
                    />
                  </div>
                  <Separator className="my-4" />
                  <p className="text-xs text-muted-foreground">
                    Internal reference: customer #{displayCustomer.id}
                  </p>
                </section>
              </>
            ) : null}
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
