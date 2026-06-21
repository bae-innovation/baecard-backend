import type { ComponentType, ReactNode } from 'react';
import { router } from '@inertiajs/react';
import {
  Calendar,
  Hash,
  Package,
  Pencil,
  Tag,
  Trash2,
  Weight,
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
import type { Product } from '@/features/products/schemas/product.schema';
import {
  formatProductDate,
  formatProductDiscount,
  formatProductMoney,
  getProductSalePrice,
  stockStatusLabel,
} from '@/features/products/utils/product-display.utils';
import { cn } from '@/lib/utils';

type ProductDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  canManage?: boolean;
  onDelete?: (product: Product) => void;
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
  highlight,
}: {
  label: string;
  value: ReactNode;
  icon: ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-background p-3">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4 shrink-0" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p
        className={cn(
          'text-lg font-semibold tabular-nums tracking-tight',
          highlight && 'text-emerald-600 dark:text-emerald-400',
        )}
      >
        {value}
      </p>
    </div>
  );
}

export function ProductDetailDialog({
  open,
  onOpenChange,
  product,
  canManage = false,
  onDelete,
}: ProductDetailDialogProps) {
  if (!product) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl" />
      </Dialog>
    );
  }

  const discountLabel = formatProductDiscount(product);
  const salePrice = getProductSalePrice(product);
  const stockStatus = stockStatusLabel(product.stock_quantity);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:max-w-4xl">
        <div className="shrink-0 border-b bg-muted/20 px-6 pb-5 pt-6">
          <DialogHeader className="space-y-4 text-left">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="shrink-0 overflow-hidden rounded-xl border bg-background shadow-sm">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-28 w-28 object-cover sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center bg-muted sm:h-32 sm:w-32">
                    <Package className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-3">
                <div>
                  <DialogTitle className="text-xl leading-tight sm:text-2xl">
                    {product.name}
                  </DialogTitle>
                  <DialogDescription className="mt-1.5 line-clamp-2">
                    {product.short_description ?? product.slug ?? 'Product details'}
                  </DialogDescription>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {product.is_featured ? <Badge variant="outline">Featured</Badge> : null}
                  <Badge variant={stockStatus.variant}>{stockStatus.label}</Badge>
                  {product.sku ? (
                    <Badge variant="outline" className="font-mono">
                      {product.sku}
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Price" value={formatProductMoney(product.price)} icon={Tag} />
            <StatCard
              label="Sale Price"
              value={formatProductMoney(salePrice)}
              icon={Tag}
              highlight={Boolean(discountLabel)}
            />
            <StatCard
              label="Stock"
              value={product.stock_quantity ?? '—'}
              icon={Package}
            />
            <StatCard
              label="Weight"
              value={product.weight != null ? `${Number(product.weight)} g` : '—'}
              icon={Weight}
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="space-y-4 p-6">
            <DetailSection title="Overview">
              <DetailField label="Product ID" value={`#${product.id}`} mono />
              <DetailField label="Slug" value={product.slug} mono />
              <DetailField label="SKU" value={product.sku} mono />
              <DetailField label="NFC Type" value={product.nfc_type} />
              <DetailField
                label="Short Description"
                value={product.short_description}
                className="sm:col-span-2"
              />
              {product.description ? (
                <div className="sm:col-span-2">
                  <DetailField
                    label="Description"
                    value={
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {product.description}
                      </p>
                    }
                  />
                </div>
              ) : null}
            </DetailSection>

            <DetailSection title="Pricing">
              <DetailField label="Price" value={formatProductMoney(product.price)} />
              <DetailField label="Discount Type" value={product.discount_type} />
              <DetailField label="Discount Value" value={product.discount_value} />
              <DetailField
                label="Discount"
                value={
                  discountLabel ? (
                    <Badge variant="secondary">{discountLabel}</Badge>
                  ) : (
                    '—'
                  )
                }
              />
              <DetailField label="Sale Price" value={formatProductMoney(salePrice)} />
            </DetailSection>

            <DetailSection title="Inventory & Media">
              <DetailField
                label="Stock Quantity"
                value={
                  <span
                    className={cn(
                      'font-medium tabular-nums',
                      product.stock_quantity === 0 && 'text-destructive',
                      product.stock_quantity != null &&
                        product.stock_quantity <= 10 &&
                        product.stock_quantity > 0 &&
                        'text-amber-600 dark:text-amber-400',
                    )}
                  >
                    {product.stock_quantity ?? '—'}
                  </span>
                }
              />
              <DetailField label="Weight" value={product.weight != null ? `${Number(product.weight)} g` : '—'} />
              <DetailField label="Image Path" value={product.image} mono className="sm:col-span-2" />
              <DetailField
                label="Gallery"
                value={
                  product.images?.length ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {product.images.map((image, index) => (
                        <span
                          key={`${image}-${index}`}
                          className="rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs"
                        >
                          {image}
                        </span>
                      ))}
                    </div>
                  ) : (
                    '—'
                  )
                }
                className="sm:col-span-2"
              />
            </DetailSection>

            <DetailSection title="Visibility & SEO">
              <DetailField
                label="Catalog Status"
                value={
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Visible' : 'Hidden'}
                  </Badge>
                }
              />
              <DetailField
                label="Featured"
                value={product.is_featured ? 'Yes — shown on homepage' : 'No'}
              />
              <DetailField label="Meta Title" value={product.meta_title} />
              <DetailField label="Meta Description" value={product.meta_description} />
            </DetailSection>

            <section className="rounded-lg border bg-card p-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-tight">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Record
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Created" value={formatProductDate(product.created_at)} />
                <DetailField label="Last Updated" value={formatProductDate(product.updated_at)} />
              </div>
              <Separator className="my-4" />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Hash className="h-3.5 w-3.5" />
                Internal reference: product #{product.id}
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
                  router.visit(`/products/${product.id}/edit`);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Product
              </Button>
              {onDelete ? (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    onOpenChange(false);
                    onDelete(product);
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
