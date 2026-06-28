import { router, useForm } from '@inertiajs/react';
import { Package } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { ProductForm } from '@/features/products/components/product-form';
import type { ProductFormValues } from '@/features/products/schemas/product.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function ProductCreatePage() {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/admin/products"
      backLabel="Back to Products"
      title="Create Product"
      description="Add a new NFC card product to your catalog"
      icon={Package}
      color="emerald"
    >
      <ProductForm
        mode="create"
        variant="page"
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/products')}
        onSubmit={async (values: ProductFormValues, image?: File | null) => {
          setProcessing(true);
          router.post(
            '/admin/products',
            objectToFormData(values as Record<string, unknown>, { image }),
            {
              forceFormData: true,
              onSuccess: () => showMutationSuccess('Product created'),
              onError: () => showMutationError(null, 'Failed to create product'),
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
