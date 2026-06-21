import { router, useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { OrderForm } from '@/features/orders/components/order-form';
import type { Order } from '@/features/orders/schemas/order.schema';
import type { OrderFormValues } from '@/features/orders/schemas/order.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type OrderEditPageProps = {
  order: Order;
};

export function OrderEditPage({ order }: OrderEditPageProps) {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/orders"
      backLabel="Back to Orders"
      title="Edit Order"
      description={order.order_number}
      icon={ShoppingCart}
    >
      <OrderForm
        key={order.id}
        mode="edit"
        variant="page"
        order={order}
        isSubmitting={processing}
        onCancel={() => router.visit('/orders')}
        onSubmit={async (values: OrderFormValues) => {
          setProcessing(true);
          router.put(`/orders/${order.id}`, values, {
            onSuccess: () => showMutationSuccess('Order updated'),
            onError: () => showMutationError(null, 'Failed to update order'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
