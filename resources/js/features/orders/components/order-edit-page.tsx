import { router, useForm, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import type { CustomerOption } from '@/features/orders/components/customer-picker';
import { OrderForm } from '@/features/orders/components/order-form';
import type { Order, OrderFormValues, ProductOption } from '@/features/orders/schemas/order.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type OrderEditPageProps = {
  order: Order;
  products: ProductOption[];
  customers: CustomerOption[];
};

export function OrderEditPage({ order }: OrderEditPageProps) {
  const { products, customers } = usePage<OrderEditPageProps>().props;
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/custom-orders"
      backLabel="Back to Custom Orders"
      title="Edit Order"
      description={order.order_number}
      icon={ShoppingCart}
    >
      <OrderForm
        key={order.id}
        mode="edit"
        variant="page"
        order={order}
        products={products}
        customers={customers}
        isSubmitting={processing}
        onCancel={() => router.visit('/custom-orders')}
        onSubmit={async (values: OrderFormValues) => {
          setProcessing(true);
          router.put(`/custom-orders/${order.id}`, values, {
            onSuccess: () => showMutationSuccess('Order updated'),
            onError: () => showMutationError(null, 'Failed to update order'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
