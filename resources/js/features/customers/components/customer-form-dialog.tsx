import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  createCustomerFormSchema,
  type CreateCustomerFormValues,
  type Customer,
  updateCustomerFormSchema,
  type UpdateCustomerFormValues,
} from '@/features/customers/schemas/customer.schema';

type CustomerFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  customer?: Customer | null;
  onSubmit: (
    values: CreateCustomerFormValues | UpdateCustomerFormValues,
  ) => Promise<void>;
  isSubmitting?: boolean;
};

export function CustomerFormDialog(props: CustomerFormDialogProps) {
  const { open, mode } = props;

  return (
    <Dialog open={open} onOpenChange={props.onOpenChange}>
      {open ? <CustomerFormDialogContent key={mode} {...props} /> : null}
    </Dialog>
  );
}

function CustomerFormDialogContent({
  onOpenChange,
  mode,
  customer,
  onSubmit,
  isSubmitting = false,
}: CustomerFormDialogProps) {
  const schema =
    mode === 'create' ? createCustomerFormSchema : updateCustomerFormSchema;

  const form = useForm<CreateCustomerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  React.useEffect(() => {
    if (mode === 'edit' && customer) {
      form.reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone ?? '',
      });
      return;
    }

    form.reset({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
    });
  }, [mode, customer, form]);

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {mode === 'create' ? 'Create customer' : 'Edit customer'}
        </DialogTitle>
        <DialogDescription>
          {mode === 'create'
            ? 'Add a new customer account for orders and card services.'
            : 'Update profile details for this customer.'}
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="jane@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === 'create' ? (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Minimum 8 characters"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password_confirmation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : null}

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="+1 555 000 0000"
                    autoComplete="tel"
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : mode === 'create' ? (
                'Create customer'
              ) : (
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
