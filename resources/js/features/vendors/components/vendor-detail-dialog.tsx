import type { ComponentType, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import {
  Calendar,
  Globe,
  Hash,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Store,
  Trash2,
} from 'lucide-react';

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
import type { Vendor } from '@/features/vendors/schemas/vendor.schema';
import { formatVendorDate } from '@/features/vendors/utils/vendor-display.utils';
import { cn } from '@/lib/utils';

type VendorDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vendor: Vendor | null;
  canManage?: boolean;
  onDelete?: (vendor: Vendor) => void;
};

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

function formatWebsite(url: string | null | undefined) {
  if (!url) return null;
  return url.replace(/^https?:\/\//, '');
}

export function VendorDetailDialog({
  open,
  onOpenChange,
  vendor,
  canManage = false,
  onDelete,
}: VendorDetailDialogProps) {
  if (!vendor) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl" />
      </Dialog>
    );
  }

  const websiteHref = vendor.website
    ? vendor.website.startsWith('http')
      ? vendor.website
      : `https://${vendor.website}`
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="shrink-0 border-b bg-muted/20 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-4 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="shrink-0 overflow-hidden rounded-xl border bg-background shadow-sm">
                {vendor.image_url ? (
                  <img
                    src={vendor.image_url}
                    alt={vendor.name}
                    className="h-28 w-28 object-cover sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center bg-muted sm:h-32 sm:w-32">
                    <Store className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <DialogTitle className="text-xl leading-tight sm:text-2xl">
                    {vendor.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 font-mono text-sm">
                    {vendor.slug}
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Email" value={vendor.email ?? '—'} icon={Mail} />
            <StatCard label="Phone" value={vendor.phone ?? '—'} icon={Phone} />
            <StatCard
              label="Website"
              value={
                websiteHref ? (
                  <a
                    href={websiteHref}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    {formatWebsite(vendor.website)}
                  </a>
                ) : (
                  '—'
                )
              }
              icon={Globe}
            />
            <StatCard
              label="Location"
              value={vendor.address ? 'On file' : '—'}
              icon={MapPin}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-4 p-6">
            <DetailSection title="Overview">
              <DetailField label="Vendor ID" value={`#${vendor.id}`} mono />
              <DetailField label="Slug" value={vendor.slug} mono />
              <DetailField label="Name" value={vendor.name} />
              <DetailField
                label="Status"
                value={
                  <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                    {vendor.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                }
              />
              {vendor.description ? (
                <div className="sm:col-span-2">
                  <DetailField
                    label="Description"
                    value={
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {vendor.description}
                      </p>
                    }
                  />
                </div>
              ) : null}
            </DetailSection>

            <DetailSection title="Contact">
              <DetailField label="Email" value={vendor.email} />
              <DetailField label="Phone" value={vendor.phone} />
              <DetailField
                label="Website"
                value={
                  websiteHref ? (
                    <a
                      href={websiteHref}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                    >
                      {vendor.website}
                    </a>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailField
                label="Address"
                value={vendor.address}
                className="sm:col-span-2"
              />
            </DetailSection>

            <DetailSection title="Media">
              <DetailField label="Image Path" value={vendor.image} mono className="sm:col-span-2" />
            </DetailSection>

            <section className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Record
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Created" value={formatVendorDate(vendor.created_at)} />
                <DetailField label="Last Updated" value={formatVendorDate(vendor.updated_at)} />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Internal reference: vendor #{vendor.id}
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-muted/10 px-6 py-4 sm:justify-between">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {canManage ? (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  router.visit(`/vendors/${vendor.id}/edit`);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Vendor
              </Button>
              {onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(vendor);
                  }}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              ) : null}
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
