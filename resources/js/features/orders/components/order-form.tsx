import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { FormSection } from '@/components/shared/form-section';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import {
  CustomerPicker,
  type CustomerOption,
} from '@/features/orders/components/customer-picker';
import {
  orderFormSchema,
  type Order,
  type OrderFormValues,
  type ProductOption,
} from '@/features/orders/schemas/order.schema';
import { cn } from '@/lib/utils';

export type OrderFormProps = {
  mode: 'create' | 'edit';
  variant?: 'dialog' | 'page';
  order?: Order | null;
  customers?: CustomerOption[];
  products?: ProductOption[];
  onSubmit: (values: OrderFormValues) => Promise<void>;
  isSubmitting?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  onCustomerCreated?: (customer: CustomerOption) => void;
};

const ORDER_STATUSES = [
  'pending',
  'processing',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
] as const;

function FormActions({
  onCancel,
  isSubmitting,
  submitLabel,
  mode,
}: {
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  mode: 'create' | 'edit';
}) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3">
      {onCancel ? (
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      ) : null}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {submitLabel ?? (mode === 'create' ? 'Create Order' : 'Save Changes')}
      </Button>
    </div>
  );
}

export function OrderForm({
  mode,
  variant = 'dialog',
  order,
  customers = [],
  products = [],
  onSubmit,
  isSubmitting,
  onCancel,
  submitLabel,
  onCustomerCreated,
}: OrderFormProps) {
  const isPage = variant === 'page';

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer_mode: 'existing',
      customer_id: '',
      new_customer: {
        name: '',
        email: '',
        phone: '',
        password: '',
      },
      product_id: '',
      product_name: '',
      unit_price: 0,
      quantity: 1,
      status: 'pending',
      discount_type: undefined,
      discount_value: '',
      discount_code: '',
      tax: '',
      shipping_cost: '',
      notes: '',
    },
  });

  const customerMode = form.watch('customer_mode');
  const selectedProductId = form.watch('product_id');
  const lastAppliedProductIdRef = React.useRef<string | number>('');

  React.useEffect(() => {
    if (!selectedProductId) {
      lastAppliedProductIdRef.current = '';
      return;
    }

    if (selectedProductId === lastAppliedProductIdRef.current) {
      return;
    }

    lastAppliedProductIdRef.current = selectedProductId;

    const product = products.find((item) => item.id === Number(selectedProductId));
    if (!product) {
      return;
    }

    form.setValue('product_name', product.name, { shouldValidate: true });
    form.setValue('unit_price', Number(product.price), { shouldValidate: true });
  }, [form, products, selectedProductId]);

  React.useEffect(() => {
    if (mode === 'edit' && order) {
      lastAppliedProductIdRef.current = order.product_id ?? '';
      form.reset({
        customer_mode: 'existing',
        customer_id: order.customer_id,
        new_customer: {
          name: '',
          email: '',
          phone: '',
          password: '',
        },
        product_id: order.product_id ?? '',
        product_name: order.product_name,
        unit_price: Number(order.unit_price),
        quantity: order.quantity,
        status: order.status,
        discount_type: order.discount_type ?? undefined,
        discount_value: order.discount_value ?? '',
        discount_code: order.discount_code ?? '',
        tax: order.tax ?? '',
        shipping_cost: order.shipping_cost ?? '',
        notes: order.notes ?? '',
      });
    }
  }, [form, mode, order]);

  const discountType = form.watch('discount_type');

  const customerProductFields = (
    <>
      {mode === 'create' ? (
        <FormField
          control={form.control}
          name="customer_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer *</FormLabel>
              <FormControl>
                <CustomerPicker
                  customers={customers}
                  mode={field.value}
                  onModeChange={(value) => {
                    field.onChange(value);
                    if (value === 'existing') {
                      form.setValue('new_customer', {
                        name: '',
                        email: '',
                        phone: '',
                        password: '',
                      });
                    } else {
                      form.setValue('customer_id', '');
                    }
                  }}
                  selectedCustomerId={
                    form.watch('customer_id') ? Number(form.watch('customer_id')) : null
                  }
                  onSelectCustomer={(customerId) => {
                    form.setValue('customer_id', customerId ?? '', {
                      shouldValidate: true,
                    });
                  }}
                  newCustomer={
                    form.watch('new_customer') ?? {
                      name: '',
                      email: '',
                      phone: '',
                      password: '',
                    }
                  }
                  onNewCustomerChange={(values) =>
                    form.setValue('new_customer', values, { shouldValidate: true })
                  }
                  disabled={isSubmitting}
                  onCustomerCreated={onCustomerCreated}
                />
              </FormControl>
              {customerMode === 'existing' ? (
                <FormField
                  control={form.control}
                  name="customer_id"
                  render={() => (
                    <FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <>
                  <FormField
                    control={form.control}
                    name="new_customer.name"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="new_customer.email"
                    render={() => (
                      <FormItem>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="customer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer *</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={String(customer.id)}>
                      {customer.name} ({customer.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      {products.length > 0 ? (
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ? String(field.value) : undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select product (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={String(product.id)}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <FormField
          control={form.control}
          name="product_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product ID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Optional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="product_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Product Name *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-2')}>
        <FormField
          control={form.control}
          name="unit_price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit Price (৳) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  value={field.value === '' || field.value == null ? '' : field.value}
                  onChange={(event) => {
                    const next = event.target.value;
                    field.onChange(next === '' ? '' : Number(next));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const pricingFields = (
    <>
      <FormField
        control={form.control}
        name="discount_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="percentage">Percentage</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="coupon">Coupon</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="discount_value"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Value</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {discountType === 'coupon' ? (
        <FormField
          control={form.control}
          name="discount_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Code</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}
      <div className={cn('grid gap-4', isPage && 'sm:grid-cols-2')}>
        <FormField
          control={form.control}
          name="tax"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tax (৳)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="shipping_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping (৳)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );

  const notesAndStatusFields = (
    <>
      {mode === 'edit' ? (
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : null}
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Textarea {...field} rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <Form {...form}>
      <form
        className={cn(isPage ? 'space-y-6 pb-6' : 'space-y-4')}
        onSubmit={form.handleSubmit(
          async (values) => {
            await onSubmit(values);
          },
          (errors) => {
            const firstError = Object.values(errors)[0];
            const message =
              firstError?.message ??
              (firstError && 'root' in firstError
                ? firstError.root?.message
                : undefined) ??
              'Please fix the highlighted fields before submitting.';
            toast.error(String(message));
          },
        )}
      >
        {isPage ? (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-start xl:gap-8">
              <div className="space-y-6">
                <FormSection title="Customer & Product" description="Who ordered what">
                  {customerProductFields}
                </FormSection>
                <FormSection title="Pricing" description="Discounts, tax, and shipping">
                  {pricingFields}
                </FormSection>
              </div>
              <FormSection title="Notes & Status" description="Internal notes and order status">
                {notesAndStatusFields}
              </FormSection>
            </div>
            <div className="sticky bottom-0 z-10 mt-8 border-t bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
              <FormActions
                onCancel={onCancel}
                isSubmitting={isSubmitting}
                submitLabel={submitLabel}
                mode={mode}
              />
            </div>
          </>
        ) : (
          <>
            {customerProductFields}
            {pricingFields}
            {notesAndStatusFields}
            <FormActions
              onCancel={onCancel}
              isSubmitting={isSubmitting}
              submitLabel={submitLabel}
              mode={mode}
            />
          </>
        )}
      </form>
    </Form>
  );
}
