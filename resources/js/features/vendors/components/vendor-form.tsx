import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { FormSection } from '@/components/shared/form-section';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  vendorFormSchema,
  type Vendor,
  type VendorFormValues,
} from '@/features/vendors/schemas/vendor.schema';

export type VendorFormProps = {
  mode: 'create' | 'edit';
  variant?: 'dialog' | 'page';
  vendor?: Vendor | null;
  onSubmit: (values: VendorFormValues, image?: File | null) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
};

function FormActions({
  onCancel,
  isSubmitting,
  submitLabel,
  mode,
}: {
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  mode: 'create' | 'edit';
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel ?? (mode === 'create' ? 'Create Vendor' : 'Save Changes')}
      </Button>
    </div>
  );
}

export function VendorForm({
  mode,
  variant = 'dialog',
  vendor,
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
}: VendorFormProps) {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState<string | null>(null);
  const isPage = variant === 'page';

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      name: '',
      slug: '',
      description: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      is_active: true,
    },
  });

  React.useEffect(() => {
    if (mode === 'edit' && vendor) {
      form.reset({
        name: vendor.name,
        slug: vendor.slug,
        description: vendor.description ?? '',
        email: vendor.email ?? '',
        phone: vendor.phone ?? '',
        address: vendor.address ?? '',
        website: vendor.website ?? '',
        is_active: vendor.is_active ?? true,
      });
    } else if (mode === 'create') {
      form.reset();
      setImageFile(null);
      setImagePreview(null);
    }
  }, [form, mode, vendor]);

  React.useEffect(() => {
    if (!imageFile) {
      setImagePreview(vendor?.image_url ?? null);
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, vendor?.image_url]);

  const basicsFields = (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="slug"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Slug *</FormLabel>
            <FormControl>
              <Input {...field} />
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
              <Textarea {...field} rows={4} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const contactFields = (
    <>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-2')}>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Textarea {...field} rows={2} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const imageField = (
    <FormItem>
      <Label>Vendor Logo</Label>
      <div className={cn('mt-2 flex gap-4', isPage ? 'flex-col' : 'flex-col sm:flex-row')}>
        <div
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-muted/40',
            isPage ? 'aspect-[4/3] w-full sm:aspect-square' : 'h-24 w-24',
          )}
        >
          {imagePreview ? (
            <img src={imagePreview} alt="Vendor preview" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <Input
          type="file"
          accept="image/*"
          className="cursor-pointer"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
        />
      </div>
    </FormItem>
  );

  const visibilityField = (
    <FormField
      control={form.control}
      name="is_active"
      render={({ field }) => (
        <FormItem className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Active</FormLabel>
            <p className="text-xs text-muted-foreground">Visible in the catalog</p>
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );

  return (
    <Form {...form}>
      <form
        className={cn(isPage ? 'space-y-6 pb-6' : 'space-y-4')}
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values, imageFile);
        })}
      >
        {isPage ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start xl:gap-8">
              <div className="space-y-6">
                <FormSection title="Basics" description="Vendor identity">
                  {basicsFields}
                </FormSection>
                <FormSection title="Contact" description="Reach vendor by email or phone">
                  {contactFields}
                </FormSection>
              </div>
              <div className="space-y-6 md:sticky md:top-4">
                <FormSection title="Logo">{imageField}</FormSection>
                <FormSection title="Visibility">{visibilityField}</FormSection>
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
            {basicsFields}
            {contactFields}
            {imageField}
            {visibilityField}
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
