import { router, useForm } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { OrderForm } from '@/features/orders/components/order-form';
import type { OrderFormValues } from '@/features/orders/schemas/order.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function OrderCreatePage() {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

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
        isSubmitting={processing}
        onCancel={() => router.visit('/custom-orders')}
        onSubmit={async (values: OrderFormValues) => {
          setProcessing(true);
          router.post('/custom-orders', values, {
            onSuccess: () => showMutationSuccess('Order created'),
            onError: () => showMutationError(null, 'Failed to create order'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
