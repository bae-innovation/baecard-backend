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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  profileServiceFormSchema,
  type ProfileService,
  type ProfileServiceFormValues,
} from '@/features/profile/schemas/profile-service.schema';
import { objectToFormData } from '@/lib/object-to-form-data';

type ServiceFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  service?: ProfileService | null;
  isSubmitting?: boolean;
  onSubmit: (values: ProfileServiceFormValues, imageFile?: File | null) => void | Promise<void>;
};

export function ServiceFormDialog({
  open,
  onOpenChange,
  mode,
  service,
  isSubmitting = false,
  onSubmit,
}: ServiceFormDialogProps) {
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const form = useForm<ProfileServiceFormValues>({
    resolver: zodResolver(profileServiceFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      is_active: true,
      sort_order: 0,
    },
  });

  React.useEffect(() => {
    if (open) {
      setImageFile(null);
      form.reset(
        mode === 'edit' && service
          ? {
              name: service.name,
              description: service.description ?? '',
              price: service.price ?? '',
              is_active: service.is_active,
              sort_order: service.sort_order ?? 0,
            }
          : {
              name: '',
              description: '',
              price: '',
              is_active: true,
              sort_order: 0,
            },
      );
    }
  }, [form, mode, open, service]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add service' : 'Edit service'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit((values) => onSubmit(values, imageFile))}
          >
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Image (optional)</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setImageFile(event.target.files?.[0] ?? null)}
                />
              </FormControl>
              {service?.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="mt-2 h-24 w-full rounded-lg object-cover"
                />
              ) : null}
            </FormItem>
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <FormLabel>Active on public card</FormLabel>
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
                {mode === 'create' ? 'Add service' : 'Save changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export function buildServiceFormData(
  values: ProfileServiceFormValues,
  imageFile?: File | null,
): FormData {
  const payload: Record<string, unknown> = {
    name: values.name,
    description: values.description ?? '',
    price: values.price === '' ? '' : values.price,
    is_active: values.is_active ?? true,
    sort_order: values.sort_order ?? 0,
  };

  if (imageFile) {
    payload.image = imageFile;
  }

  return objectToFormData(payload);
}
