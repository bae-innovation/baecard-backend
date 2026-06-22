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
import { Textarea } from '@/components/ui/textarea';
import { updateSettingsGroup } from '@/features/settings/api/settings.api';
import {
  SettingsFormActions,
  SettingsFormSection,
} from '@/features/settings/components/settings-form-section';
import {
  generalSettingsSchema,
  type GeneralSettings,
  type GeneralSettingsFormValues,
} from '@/features/settings/schemas/settings.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type GeneralSettingsTabProps = {
  settings: GeneralSettings;
};

export function GeneralSettingsTab({ settings }: GeneralSettingsTabProps) {
  const [processing, setProcessing] = React.useState(false);

  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      site_name: settings.site_name ?? '',
      tagline: settings.tagline ?? '',
      site_url: settings.site_url ?? '',
      contact_email: settings.contact_email ?? '',
      support_phone: settings.support_phone ?? '',
      street: settings.street ?? '',
      city: settings.city ?? '',
      state: settings.state ?? '',
      country: settings.country ?? '',
      postal_code: settings.postal_code ?? '',
      privacy_policy_url: settings.privacy_policy_url ?? '',
      terms_url: settings.terms_url ?? '',
      copyright_text: settings.copyright_text ?? '',
    },
  });

  const onSubmit = (values: GeneralSettingsFormValues) => {
    setProcessing(true);
    updateSettingsGroup('general', values, undefined, {
      onSuccess: () => showMutationSuccess('General settings saved'),
      onError: () => showMutationError(null, 'Failed to save general settings'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsFormSection
          title="Site Information"
          description="Basic details shown across your site and communications."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="site_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="BAE Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Digital NFC Business Cards" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="site_url"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Site URL *</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormSection>

        <SettingsFormSection
          title="Contact"
          description="How customers and partners can reach you."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="contact@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="support_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Support Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+880 1XXX-XXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Address" description="Your business location.">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main Street" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State / Region</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SettingsFormSection>

        <SettingsFormSection title="Legal" description="Links and copyright text for your site.">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="privacy_policy_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Privacy Policy URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/privacy" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="terms_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Terms of Service URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://example.com/terms" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="copyright_text"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Copyright Text</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="© 2026 BAE Card. All rights reserved." {...field} />
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
