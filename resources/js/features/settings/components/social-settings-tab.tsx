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
  socialSettingsSchema,
  type SocialSettings,
  type SocialSettingsFormValues,
} from '@/features/settings/schemas/settings.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type SocialSettingsTabProps = {
  settings: SocialSettings;
};

export function SocialSettingsTab({ settings }: SocialSettingsTabProps) {
  const [processing, setProcessing] = React.useState(false);

  const form = useForm<SocialSettingsFormValues>({
    resolver: zodResolver(socialSettingsSchema),
    defaultValues: {
      whatsapp: settings.whatsapp ?? '',
      facebook: settings.facebook ?? '',
      instagram: settings.instagram ?? '',
      twitter: settings.twitter ?? '',
      linkedin: settings.linkedin ?? '',
      youtube: settings.youtube ?? '',
      tiktok: settings.tiktok ?? '',
    },
  });

  const onSubmit = (values: SocialSettingsFormValues) => {
    setProcessing(true);
    updateSettingsGroup('social', values, undefined, {
      onSuccess: () => showMutationSuccess('Social settings saved'),
      onError: () => showMutationError(null, 'Failed to save social settings'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SettingsFormSection
          title="Social Profiles"
          description="Links to your social media accounts shown on your site and cards."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="+880 1XXX-XXXXXX or profile link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://facebook.com/yourpage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://instagram.com/yourpage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://x.com/yourpage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://linkedin.com/company/yourpage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="youtube"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://youtube.com/@yourchannel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tiktok"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://tiktok.com/@yourpage" {...field} />
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
