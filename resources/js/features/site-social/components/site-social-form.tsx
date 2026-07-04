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
import {
  PLATFORM_LABELS,
  PROFILE_PLATFORMS,
  siteSocialFormSchema,
  siteSocialToFormValues,
  type ProfilePlatform,
  type SiteSocialFormValues,
  type SiteSocialLink,
} from '@/features/site-social/schemas/site-social.schema';

type SiteSocialFormProps = {
  mode: 'create' | 'edit';
  siteSocialLink?: SiteSocialLink | null;
  platforms?: readonly string[];
  onSubmit: (values: SiteSocialFormValues) => Promise<void>;
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

export function SiteSocialForm({
  mode,
  siteSocialLink,
  platforms = PROFILE_PLATFORMS,
  onSubmit,
  isSubmitting,
  onCancel,
}: SiteSocialFormProps) {
  const form = useForm<SiteSocialFormValues>({
    resolver: zodResolver(siteSocialFormSchema),
    defaultValues: {
      platform: 'whatsapp',
      platform_value: '',
      url: '',
      label: '',
      is_active: true,
      show_in_floating: true,
      sort_order: 0,
    },
  });

  React.useEffect(() => {
    if (mode === 'edit' && siteSocialLink) {
      form.reset(siteSocialToFormValues(siteSocialLink));
    }
  }, [form, mode, siteSocialLink]);

  const platformOptions = platforms.filter((platform): platform is ProfilePlatform =>
    PROFILE_PLATFORMS.includes(platform as ProfilePlatform),
  );

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <FormSection
          title="Social link"
          description="Choose a platform and provide the phone number, username, or URL value."
        >
          <FormField
            control={form.control}
            name="platform"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Platform</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {platformOptions.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {PLATFORM_LABELS[platform]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="platform_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Value</FormLabel>
                <FormControl>
                  <Input placeholder="+8801XXXXXXXXX or username / page slug" {...field} />
                </FormControl>
                <FormDescription>
                  Phone number for Phone/WhatsApp, username for social networks, or full URL.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Custom URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
                </FormControl>
                <FormDescription>Override the auto-generated link if needed.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Support WhatsApp" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormSection>

        <FormSection title="Visibility">
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="show_in_floating"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <FormLabel>Show in floating dock</FormLabel>
                  <FormDescription>Display on the left-bottom floating icons on the website.</FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
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
                  <FormDescription>Inactive links are hidden from the public site.</FormDescription>
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
            {mode === 'create' ? 'Create Social Link' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
