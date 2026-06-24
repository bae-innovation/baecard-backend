import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
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
  profileSocialFormSchema,
  type ProfileSocial,
  type ProfileSocialFormValues,
} from '@/features/profile/schemas/profile-social.schema';

type SocialFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  social?: ProfileSocial | null;
  isSubmitting?: boolean;
  onSubmit: (values: ProfileSocialFormValues) => void | Promise<void>;
};

export function SocialFormDialog({
  open,
  onOpenChange,
  mode,
  social,
  isSubmitting = false,
  onSubmit,
}: SocialFormDialogProps) {
  const form = useForm<ProfileSocialFormValues>({
    resolver: zodResolver(profileSocialFormSchema),
    defaultValues: {
      platform: 'whatsapp',
      platform_value: '',
      url: '',
      label: '',
      is_primary: false,
      sort_order: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
      form.reset(
        mode === 'edit' && social
          ? {
              platform: social.platform,
              platform_value: social.platform_value,
              url: social.url ?? '',
              label: social.label ?? '',
              is_primary: social.is_primary ?? false,
              sort_order: social.sort_order ?? 0,
            }
          : {
              platform: 'whatsapp',
              platform_value: '',
              url: '',
              label: '',
              is_primary: false,
              sort_order: 0,
            },
      );
    }
  }, [form, mode, open, social]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add social link' : 'Edit social link'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
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
                      {PROFILE_PLATFORMS.map((platform) => (
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
                  <FormLabel>Username / value *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="username or phone/email value" />
                  </FormControl>
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
                    <Input {...field} placeholder="https://..." />
                  </FormControl>
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
                    <Input {...field} placeholder="Display label" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_primary"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Primary</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                {mode === 'create' ? 'Add link' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
