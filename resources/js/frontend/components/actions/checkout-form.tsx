import { router } from '@inertiajs/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Minus, Plus } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { submitPublicOrder } from '@frontend/lib/marketing-api';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingProduct } from '@frontend/types/marketing';
import { formatPrice, getDiscountedPrice } from '@frontend/utils/format-price';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppSettings } from '@/hooks/useAppSettings';

import { MarketingButton } from '../ui/marketing-button';

const phoneSchema = z
  .string()
  .length(11, 'Invalid mobile number')
  .regex(/^01[0-9]{9}$/, 'Invalid mobile number');

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  quantity: z.coerce.number().int().min(1).max(99),
  notes: z.string().max(2000).optional(),
});

type FormValues = z.infer<typeof schema>;

type CheckoutFormProps = {
  product: MarketingProduct;
};

export function CheckoutForm({ product }: CheckoutFormProps) {
  const { translate } = useMarketingContent();
  const { currency_symbol } = useAppSettings();
  const [submitting, setSubmitting] = React.useState(false);

  const unitPrice = getDiscountedPrice(product) ?? Number(product.price ?? 0);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      quantity: 1,
      notes: '',
    },
  });

  const quantity = form.watch('quantity');
  const lineTotal = unitPrice * quantity;

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const response = await submitPublicOrder({
        name: values.name,
        phone: values.phone,
        product_id: product.id,
        quantity: values.quantity,
        notes: values.notes?.trim() || undefined,
      });

      router.visit(`/order/thank-you/${response.data.order_number}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not process your order.');
    } finally {
      setSubmitting(false);
    }
  }

  function adjustQuantity(delta: number) {
    const next = Math.min(99, Math.max(1, quantity + delta));
    form.setValue('quantity', next, { shouldValidate: true });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="checkout-quantity">
          {translate({ en: 'Quantity', bn: 'পরিমাণ' })}
        </Label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => adjustQuantity(-1)}
            disabled={quantity <= 1 || submitting}
            className="fe-touch inline-flex size-10 items-center justify-center rounded-xl border border-fe-border bg-fe-surface text-fe-text transition hover:border-fe-accent hover:text-fe-accent disabled:opacity-40"
            aria-label={translate({ en: 'Decrease quantity', bn: 'পরিমাণ কমান' })}
          >
            <Minus className="size-4" />
          </button>
          <Input
            id="checkout-quantity"
            type="number"
            min={1}
            max={99}
            className="border-fe-border bg-fe-surface/50 text-center"
            {...form.register('quantity')}
          />
          <button
            type="button"
            onClick={() => adjustQuantity(1)}
            disabled={quantity >= 99 || submitting}
            className="fe-touch inline-flex size-10 items-center justify-center rounded-xl border border-fe-border bg-fe-surface text-fe-text transition hover:border-fe-accent hover:text-fe-accent disabled:opacity-40"
            aria-label={translate({ en: 'Increase quantity', bn: 'পরিমাণ বাড়ান' })}
          >
            <Plus className="size-4" />
          </button>
        </div>
        {form.formState.errors.quantity ? (
          <p className="text-sm text-red-400">{form.formState.errors.quantity.message}</p>
        ) : null}
      </div>

      <div className="rounded-xl border border-fe-border/80 bg-fe-surface/40 p-4">
        <div className="flex items-center justify-between text-sm text-fe-muted">
          <span>{translate({ en: 'Unit price', bn: 'একক মূল্য' })}</span>
          <span className="font-medium text-fe-text">{formatPrice(unitPrice, currency_symbol)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-fe-border/60 pt-2">
          <span className="text-sm font-semibold text-fe-text">
            {translate({ en: 'Total', bn: 'মোট' })}
          </span>
          <span className="text-lg font-bold text-fe-accent">
            {formatPrice(lineTotal, currency_symbol)}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkout-name">
          {translate({ en: 'Full name', bn: 'পুরো নাম' })} *
        </Label>
        <Input
          id="checkout-name"
          className="border-fe-border bg-fe-surface/50"
          {...form.register('name')}
        />
        {form.formState.errors.name ? (
          <p className="text-sm text-red-400">{form.formState.errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkout-phone">
          {translate({ en: 'Mobile number', bn: 'মোবাইল নম্বর' })} *
        </Label>
        <Input
          id="checkout-phone"
          placeholder="01XXXXXXXXX"
          className="border-fe-border bg-fe-surface/50"
          {...form.register('phone')}
        />
        {form.formState.errors.phone ? (
          <p className="text-sm text-red-400">{form.formState.errors.phone.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkout-notes">
          {translate({ en: 'Notes (optional)', bn: 'নোট (ঐচ্ছিক)' })}
        </Label>
        <Textarea
          id="checkout-notes"
          rows={3}
          className="border-fe-border bg-fe-surface/50 resize-none"
          placeholder={translate({
            en: 'Delivery preferences, company name, etc.',
            bn: 'ডেলিভারি পছন্দ, কোম্পানির নাম ইত্যাদি।',
          })}
          {...form.register('notes')}
        />
      </div>

      <div className="rounded-2xl border border-fe-accent/20 bg-fe-accent/5 p-4 pt-5">
        <MarketingButton
          type="submit"
          variant="solid"
          size="lg"
          className="w-full bg-fe-accent font-semibold text-fe-bg shadow-[0_10px_28px_color-mix(in_srgb,var(--fe-accent)_35%,transparent)] ring-2 ring-fe-accent/20 hover:brightness-110"
          disabled={submitting}
        >
          {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
          {translate({ en: 'Process Order', bn: 'অর্ডার প্রক্রিয়া করুন' })}
        </MarketingButton>
      </div>
    </form>
  );
}
