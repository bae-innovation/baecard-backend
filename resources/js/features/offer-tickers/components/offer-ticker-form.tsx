import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  OFFER_TICKER_THEME_GRADIENTS,
  OFFER_TICKER_THEME_LABELS,
  OFFER_TICKER_THEMES,
  offerTickerFormSchema,
  offerTickerToFormValues,
  type OfferTicker,
  type OfferTickerFormValues,
  type OfferTickerTheme,
} from '@/features/offer-tickers/schemas/offer-ticker.schema';

type OfferTickerFormProps = {
  mode: 'create' | 'edit';
  offerTicker?: OfferTicker | null;
  onSubmit: (values: OfferTickerFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-5">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ThemePreview({ theme }: { theme: OfferTickerTheme }) {
  return (
    <div
      className="mt-2 flex min-h-10 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white shadow-inner"
      style={{ background: OFFER_TICKER_THEME_GRADIENTS[theme] }}
    >
      Preview — {OFFER_TICKER_THEME_LABELS[theme]}
    </div>
  );
}

export function OfferTickerForm({
  mode,
  offerTicker,
  onSubmit,
  isSubmitting,
  onCancel,
}: OfferTickerFormProps) {
  const form = useForm<OfferTickerFormValues>({
    resolver: zodResolver(offerTickerFormSchema),
    defaultValues: {
      message_en: '',
      message_bn: '',
      badge_en: '',
      badge_bn: '',
      href: '',
      theme: 'coral',
      is_active: true,
      sort_order: 0,
    },
  });

  const selectedTheme = form.watch('theme');

  React.useEffect(() => {
    if (mode === 'edit' && offerTicker) {
      form.reset(offerTickerToFormValues(offerTicker));
    }
  }, [form, mode, offerTicker]);

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <FormSection
          title="Ticker message"
          description="Promotional text shown in the home page marquee. Provide both English and Bengali."
        >
          <FormField
            control={form.control}
            name="message_en"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (English)</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="🌸 New year sale — 25% off!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message_bn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Bengali)</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="🌸 নতুন বছরে ২৫% ছাড়!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Badge & link" description="Optional highlight label and click destination.">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="badge_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Sale" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="badge_bn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge (Bengali)</FormLabel>
                  <FormControl>
                    <Input placeholder="ছাড়" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="href"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link URL</FormLabel>
                <FormControl>
                  <Input placeholder="/products" {...field} />
                </FormControl>
                <FormDescription>Leave empty for a non-clickable ticker.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Appearance & order">
          <FormField
            control={form.control}
            name="theme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color theme</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {OFFER_TICKER_THEMES.map((theme) => (
                      <SelectItem key={theme} value={theme}>
                        {OFFER_TICKER_THEME_LABELS[theme]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <ThemePreview theme={selectedTheme} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormDescription>Lower numbers appear first in the marquee.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel>Active</FormLabel>
                  <FormDescription>Show this ticker on the public website.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </FormSection>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === 'create' ? 'Create Offer Ticker' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
