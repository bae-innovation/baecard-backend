import { router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { OrderForm } from '@/features/orders/components/order-form';
import type { CustomerOption } from '@/features/orders/components/customer-picker';
import type {
  OrderFormValues,
  ProductOption,
} from '@/features/orders/schemas/order.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type CreatePageProps = {
  products: ProductOption[];
  customers: CustomerOption[];
};

function buildOrderPayload(values: OrderFormValues) {
  const payload: Record<string, unknown> = {
    product_id: values.product_id ? Number(values.product_id) : null,
    product_name: values.product_name,
    unit_price: values.unit_price === '' ? 0 : values.unit_price,
    quantity: values.quantity,
    discount_type: values.discount_type || null,
    discount_value: values.discount_value === '' ? null : values.discount_value,
    discount_code: values.discount_code || null,
    tax: values.tax === '' ? null : values.tax,
    shipping_cost: values.shipping_cost === '' ? null : values.shipping_cost,
    notes: values.notes || null,
  };

  if (values.customer_mode === 'existing') {
    payload.customer_id = Number(values.customer_id);
  } else if (values.new_customer) {
    payload.new_customer = {
      name: values.new_customer.name,
      email: values.new_customer.email,
      phone: values.new_customer.phone?.trim() || null,
      password: values.new_customer.password?.trim() || undefined,
    };
  }

  return payload;
}

export function OrderCreatePage() {
  const { products, customers: initialCustomers } = usePage<CreatePageProps>().props;
  const [customers, setCustomers] = React.useState(initialCustomers);
  const [processing, setProcessing] = React.useState(false);

  return (
    <FormPageShell
      backTo="/custom-orders"
      backLabel="Back to Custom Orders"
      title="Create Order"
      description="Create a manually managed customer order"
      icon={ShoppingCart}
    >
      <OrderForm
        mode="create"
        variant="page"
        products={products}
        customers={customers}
        isSubmitting={processing}
        onCancel={() => router.visit('/custom-orders')}
        onCustomerCreated={(customer) => {
          setCustomers((current) => {
            if (current.some((item) => item.id === customer.id)) {
              return current;
            }

            return [...current, customer].sort((a, b) => a.name.localeCompare(b.name));
          });
        }}
        onSubmit={async (values: OrderFormValues) => {
          setProcessing(true);
          router.post('/custom-orders', buildOrderPayload(values), {
            onSuccess: () => showMutationSuccess('Order created'),
            onError: () => showMutationError(null, 'Failed to create order'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
