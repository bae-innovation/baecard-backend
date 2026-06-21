import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  productFormSchema,
  type Product,
  type ProductFormValues,
} from '@/features/products/schemas/product.schema';

export type ProductFormProps = {
  mode: 'create' | 'edit';
  variant?: 'dialog' | 'page';
  product?: Product | null;
  onSubmit: (values: ProductFormValues, image?: File | null) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-xl border bg-card p-5 shadow-sm md:p-6', className)}>
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function FormActions({
  onCancel,
  isSubmitting,
  submitLabel,
  mode,
  className,
}: {
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  mode: 'create' | 'edit';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3',
        className,
      )}
    >
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel ?? (mode === 'create' ? 'Create Product' : 'Save Changes')}
      </Button>
    </div>
  );
}

export function ProductForm({
  mode,
  variant = 'dialog',
  product,
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
}: ProductFormProps) {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const isPage = variant === 'page';

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      short_description: '',
      sku: '',
      price: undefined,
      discount_type: undefined,
      discount_value: undefined,
      stock_quantity: undefined,
      nfc_type: '',
      weight: undefined,
      is_active: true,
      is_featured: false,
      meta_title: '',
      meta_description: '',
    },
  });

  React.useEffect(() => {
    if (mode === 'edit' && product) {
      form.reset({
        name: product.name,
        slug: product.slug ?? '',
        description: product.description ?? '',
        short_description: product.short_description ?? '',
        sku: product.sku ?? '',
        price: product.price ?? undefined,
        discount_type: product.discount_type ?? undefined,
        discount_value: product.discount_value ?? undefined,
        stock_quantity: product.stock_quantity ?? undefined,
        nfc_type: product.nfc_type ?? '',
        weight: product.weight ?? undefined,
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        meta_title: product.meta_title ?? '',
        meta_description: product.meta_description ?? '',
      });
    } else if (mode === 'create') {
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    }
  }, [form, mode, product]);

  React.useEffect(() => {
    if (!imageFile) {
      setImagePreview(product?.image_url ?? null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, product?.image_url]);

  const basicsFields = (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input placeholder="NFC Business Card" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-2')}>
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="nfc-business-card" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="NFC-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="short_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Short Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} placeholder="Brief summary for listings" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={4} placeholder="Full product description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const pricingFields = (
    <>
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-3')}>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="percentage">Percentage</SelectItem>
                  <SelectItem value="fixed">Fixed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Value</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const physicalFields = (
    <>
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-3')}>
        <FormField
          control={form.control}
          name="nfc_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>NFC Type</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. NTAG215" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="stock_quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Stock Quantity</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const seoFields = (
    <>
      <FormField
        control={form.control}
        name="meta_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="SEO page title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="meta_description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Meta Description</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} placeholder="SEO meta description" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const imageField = (
    <FormItem>
      <Label>Product Image</Label>
      <div
        className={cn(
          'mt-2 flex gap-4',
          isPage ? 'flex-col' : 'flex-col sm:flex-row sm:items-start',
        )}
      >
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40',
            isPage ? 'aspect-[4/3] w-full sm:aspect-square' : 'h-32 w-32',
          )}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Product preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input
            type="file"
            accept="image/*"
            className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-sm file:font-medium file:text-primary-foreground"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          <p className="text-xs text-muted-foreground">
            JPG, PNG or WebP. Recommended at least 400×400px.
          </p>
        </div>
      </div>
    </FormItem>
  );

  const visibilityFields = (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Active</FormLabel>
              <p className="text-xs text-muted-foreground">Visible in the store</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="is_featured"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Featured</FormLabel>
              <p className="text-xs text-muted-foreground">Highlight on homepage</p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form
        className={cn(isPage ? 'space-y-6 pb-6' : 'space-y-6')}
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values, imageFile);
        })}
      >
        {isPage ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start xl:gap-8">
              <div className="space-y-6">
                <FormSection title="Basics" description="Core product information">
                  {basicsFields}
                </FormSection>
                <FormSection title="Pricing" description="Price and discount settings">
                  {pricingFields}
                </FormSection>
                <FormSection title="SEO" description="Search engine metadata">
                  {seoFields}
                </FormSection>
              </div>

              <div className="space-y-6 md:sticky md:top-4">
                <FormSection title="Product Image" description="Upload a catalog photo">
                  {imageField}
                </FormSection>
                <FormSection title="Visibility" description="Catalog display options">
                  {visibilityFields}
                </FormSection>
                <FormSection title="NFC & Inventory" description="Physical specs and stock">
                  {physicalFields}
                </FormSection>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 mt-8 border-t bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <FormActions
                onCancel={onCancel}
                isSubmitting={isSubmitting}
                submitLabel={submitLabel}
                mode={mode}
              />
            </div>
          </>
        ) : (
          <>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Basics</p>
              {basicsFields}
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">Pricing</p>
              {pricingFields}
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">NFC / Physical</p>
              {physicalFields}
              {imageField}
            </div>
            <div className="space-y-4">
              <p className="text-sm font-medium text-muted-foreground">SEO</p>
              {seoFields}
            </div>
            {visibilityFields}
            <FormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              mode={mode}
            />
          </>
        )}
      </form>
    </Form>
  );
}
