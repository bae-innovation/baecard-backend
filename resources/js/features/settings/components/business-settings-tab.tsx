import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { updateSettingsGroup } from '@/features/settings/api/settings.api';
import {
  SettingsFormActions,
  SettingsFormSection,
} from '@/features/settings/components/settings-form-section';
import {
  businessSettingsSchema,
  type BusinessSettings,
  type BusinessSettingsFormValues,
} from '@/features/settings/schemas/settings.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type BusinessSettingsTabProps = {
  settings: BusinessSettings;
};

export function BusinessSettingsTab({ settings }: BusinessSettingsTabProps) {
  const [processing, setProcessing] = React.useState(false);

  const form = useForm<BusinessSettingsFormValues>({
    resolver: zodResolver(businessSettingsSchema),
    defaultValues: {
      currency: settings.currency ?? 'BDT',
      currency_symbol: settings.currency_symbol ?? '৳',
      tax_rate: Number(settings.tax_rate ?? 0),
      order_prefix: settings.order_prefix ?? 'BAE-',
    },
  });

  const onSubmit = (values: BusinessSettingsFormValues) => {
    setProcessing(true);
    updateSettingsGroup('business', values, undefined, {
      onSuccess: () => showMutationSuccess('Business settings saved'),
      onError: () => showMutationError(null, 'Failed to save business settings'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsFormSection
          title="Currency"
          description="Default currency used for products and orders."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Code *</FormLabel>
                  <FormControl>
                    <Input placeholder="BDT" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency_symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency Symbol *</FormLabel>
                  <FormControl>
                    <Input placeholder="৳" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormSection>

        <SettingsFormSection
          title="Orders & Tax"
          description="Configure order numbering and default tax rate."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="order_prefix"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Number Prefix *</FormLabel>
                  <FormControl>
                    <Input placeholder="BAE-" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tax_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Tax Rate (%) *</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} max={100} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormSection>

        <SettingsFormActions isSubmitting={processing} />
      </form>
    </Form>
  );
}
