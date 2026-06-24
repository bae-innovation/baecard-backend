import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { DeleteCustomerSocialDialog } from '@/features/customer-socials/components/delete-customer-social-dialog';
import {
  customerSocialFormSchema,
  type CustomerSocial,
  type CustomerSocialFormValues,
} from '@/features/customer-socials/schemas/customer-social.schema';
import { showMutationError } from '@/lib/mutation-toast';

const PLATFORMS = [
  'whatsapp',
  'facebook',
  'instagram',
  'twitter',
  'linkedin',
  'tiktok',
  'youtube',
  'snapchat',
  'other',
] as const;

type CustomerSocialsPanelProps = {
  customerId: number;
  socials?: CustomerSocial[];
  onReload?: () => void;
};

function getDefaultValues(customerId: number): CustomerSocialFormValues {
  return {
    customer_id: customerId,
    platform: 'whatsapp',
    platform_value: '',
    url: '',
    label: '',
    fn: '',
    is_primary: false,
    sort_order: 0,
  };
}

export function CustomerSocialsPanel({
  customerId,
  socials = [],
  onReload,
}: CustomerSocialsPanelProps) {
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selected, setSelected] = React.useState<CustomerSocial | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedForDelete, setSelectedForDelete] = React.useState<CustomerSocial | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const reload = React.useCallback(() => {
    if (onReload) {
      onReload();
      return;
    }
    router.reload();
  }, [onReload]);

  const openCreate = () => {
    setFormMode('create');
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (social: CustomerSocial) => {
    setFormMode('edit');
    setSelected(social);
    setFormOpen(true);
  };

  const openDelete = (social: CustomerSocial) => {
    setSelectedForDelete(social);
    setDeleteOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Social Links</CardTitle>
          <Button size="sm" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {socials.length === 0 ? (
            <p className="text-sm text-muted-foreground">No social links yet.</p>
          ) : (
            socials.map((social) => (
              <div
                key={social.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{social.platform}</Badge>
                    {social.is_primary ? <Badge>Primary</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm font-medium">{social.platform_value}</p>
                  {social.label ? (
                    <p className="text-xs text-muted-foreground">{social.label}</p>
                  ) : null}
                  {social.fn ? (
                    <p className="text-xs text-muted-foreground">FN: {social.fn}</p>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(social)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openDelete(social)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <CustomerSocialFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        customerId={customerId}
        social={selected}
        isSubmitting={isSubmitting}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          if (formMode === 'create') {
            router.post(`/customers/${customerId}/social-links`, values, {
              preserveScroll: true,
              onSuccess: () => {
                setFormOpen(false);
                reload();
              },
              onError: (errors) => {
                if (!errors?.form) {
                  showMutationError(null, 'Failed to add social link');
                }
              },
              onFinish: () => setIsSubmitting(false),
            });
            return;
          }
          if (!selected) {
            setIsSubmitting(false);
            return;
          }
          router.put(`/customers/${customerId}/social-links/${selected.id}`, values, {
            preserveScroll: true,
            onSuccess: () => {
              setFormOpen(false);
              reload();
            },
            onError: (errors) => {
              if (!errors?.form) {
                showMutationError(null, 'Failed to update social link');
              }
            },
            onFinish: () => setIsSubmitting(false),
          });
        }}
      />

      <DeleteCustomerSocialDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        social={selectedForDelete}
        isDeleting={isDeleting}
        onConfirm={async () => {
          if (!selectedForDelete) return;
          setIsDeleting(true);
          router.delete(`/customers/${customerId}/social-links/${selectedForDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
              setDeleteOpen(false);
              setSelectedForDelete(null);
              reload();
            },
            onError: (errors) => {
              if (!errors?.form) {
                showMutationError(null, 'Failed to remove social link');
              }
            },
            onFinish: () => setIsDeleting(false),
          });
        }}
      />
    </>
  );
}

type CustomerSocialFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  customerId: number;
  social?: CustomerSocial | null;
  onSubmit: (values: CustomerSocialFormValues) => Promise<void>;
  isSubmitting?: boolean;
};

function CustomerSocialFormDialog(props: CustomerSocialFormDialogProps) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.open ? <CustomerSocialFormContent {...props} /> : null}
    </Dialog>
  );
}

function CustomerSocialFormContent({
  onOpenChange,
  mode,
  customerId,
  social,
  onSubmit,
  isSubmitting,
}: CustomerSocialFormDialogProps) {
  const form = useForm<CustomerSocialFormValues>({
    resolver: zodResolver(customerSocialFormSchema),
    defaultValues: getDefaultValues(customerId),
  });

  React.useEffect(() => {
    if (mode === 'edit' && social) {
      form.reset({
        customer_id: social.customer_id,
        platform: social.platform,
        platform_value: social.platform_value,
        url: social.url ?? '',
        label: social.label ?? '',
        fn: social.fn ?? '',
        is_primary: social.is_primary ?? false,
        sort_order: social.sort_order ?? 0,
      });
    } else if (mode === 'create') {
      form.reset(getDefaultValues(customerId));
    }
  }, [customerId, form, mode, social]);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {mode === 'create' ? 'Add Social Link' : 'Edit Social Link'}
        </DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (values) => {
            await onSubmit(values);
          })}
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
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform} value={platform}>
                        {platform}
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
                <FormLabel>Platform Value *</FormLabel>
                <FormControl>
                  <Input placeholder="Phone, handle, etc." {...field} />
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
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://..." {...field} />
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
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>FN</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sort Order</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_primary"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between">
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
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
