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
  emailSettingsSchema,
  type EmailSettings,
  type EmailSettingsFormValues,
} from '@/features/settings/schemas/settings.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type EmailSettingsTabProps = {
  settings: EmailSettings;
};

export function EmailSettingsTab({ settings }: EmailSettingsTabProps) {
  const [processing, setProcessing] = React.useState(false);

  const form = useForm<EmailSettingsFormValues>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      from_name: settings.from_name ?? '',
      from_email: settings.from_email ?? '',
      support_email: settings.support_email ?? '',
    },
  });

  const onSubmit = (values: EmailSettingsFormValues) => {
    setProcessing(true);
    updateSettingsGroup('email', values, undefined, {
      onSuccess: () => showMutationSuccess('Email settings saved'),
      onError: () => showMutationError(null, 'Failed to save email settings'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsFormSection
          title="Email Sender"
          description="Default sender details for outgoing emails. SMTP credentials are configured in your .env file."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="from_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="BAE Card" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="from_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="noreply@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="support_email"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Support Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="support@example.com" {...field} />
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
