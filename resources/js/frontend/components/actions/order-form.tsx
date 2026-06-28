import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { useActionHub } from '@frontend/hooks/use-action-hub';
import { submitContact } from '@frontend/lib/marketing-api';
import type { MarketingProduct } from '@frontend/types/marketing';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { MarketingButton } from '../ui/marketing-button';

const phoneSchema = z
  .string()
  .length(11, 'Invalid mobile number')
  .regex(/^01[0-9]{9}$/, 'Invalid mobile number');

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  product_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type OrderFormProps = {
  products: MarketingProduct[];
  preselected?: MarketingProduct | null;
  variant?: 'drawer' | 'inline';
  onComplete?: () => void;
};

export function OrderForm({
  products,
  preselected,
  variant = 'drawer',
  onComplete,
}: OrderFormProps) {
  const { vendorSlug, closeHub } = useActionHub();
  const [submitting, setSubmitting] = React.useState(false);
  const isInline = variant === 'inline';
  const inputClassName = isInline ? 'border-fe-border bg-fe-surface/50' : 'bg-white/5 border-white/20';

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      product_id: preselected ? String(preselected.id) : products[0] ? String(products[0].id) : '',
    },
  });

  React.useEffect(() => {
    if (preselected) {
      form.setValue('product_id', String(preselected.id));
    }
  }, [preselected, form]);

  async function onSubmit(values: FormValues) {
    const product =
      products.find((p) => String(p.id) === values.product_id) ?? preselected ?? products[0];

    setSubmitting(true);
    try {
      await submitContact({
        name: values.name,
        phone: values.phone,
        subject: 'order',
        metadata: {
          product_id: product?.id,
          product_name: product?.name,
          vendor_slug: vendorSlug,
        },
      });
      toast.success("Order received — we'll call you shortly.");
      form.reset({
        name: '',
        phone: '',
        product_id: preselected ? String(preselected.id) : products[0] ? String(products[0].id) : '',
      });
      if (isInline) {
        onComplete?.();
      } else {
        closeHub();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not submit order.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {isInline && preselected ? (
        <p className="text-center text-sm font-semibold text-fe-text">{preselected.name}</p>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor={isInline ? `order-name-${preselected?.id ?? 'inline'}` : 'order-name'}>
          Full name
        </Label>
        <Input
          id={isInline ? `order-name-${preselected?.id ?? 'inline'}` : 'order-name'}
          {...form.register('name')}
          className={inputClassName}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
        ) : null}
      </div>
      <div className="space-y-2">
        <Label htmlFor={isInline ? `order-phone-${preselected?.id ?? 'inline'}` : 'order-phone'}>
          Mobile
        </Label>
        <Input
          id={isInline ? `order-phone-${preselected?.id ?? 'inline'}` : 'order-phone'}
          placeholder="01XXXXXXXXX"
          {...form.register('phone')}
          className={inputClassName}
        />
        {form.formState.errors.phone ? (
          <p className="text-sm text-red-400">{form.formState.errors.phone.message}</p>
        ) : null}
      </div>
      {products.length > 0 && !isInline ? (
        <div className="space-y-2">
          <Label>Product</Label>
          <Select
            value={form.watch('product_id')}
            onValueChange={(v) => form.setValue('product_id', v)}
          >
            <SelectTrigger className="bg-white/5 border-white/20">
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      <MarketingButton type="submit" variant="solid" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
        Submit order
      </MarketingButton>
    </form>
  );
}
