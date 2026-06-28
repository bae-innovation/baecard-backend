import { router, useForm } from '@inertiajs/react';
import { Package } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { ProductForm } from '@/features/products/components/product-form';
import type { Product } from '@/features/products/schemas/product.schema';
import type { ProductFormValues } from '@/features/products/schemas/product.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationSuccess } from '@/lib/mutation-toast';
import { toast } from 'sonner';

type ProductEditPageProps = {
  product: Product;
};

export function ProductEditPage({ product }: ProductEditPageProps) {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/admin/products"
      backLabel="Back to Products"
      title="Edit Product"
      description={product.name}
      icon={Package}
      color="emerald"
    >
      <ProductForm
        key={product.id}
        mode="edit"
        variant="page"
        product={product}
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/products')}
        onSubmit={async (values: ProductFormValues, image?: File | null) => {
          setProcessing(true);
          router.post(
            `/admin/products/${product.id}`,
            objectToFormData(values as Record<string, unknown>, { image }, 'PUT'),
            {
              forceFormData: true,
              onSuccess: () => showMutationSuccess('Product updated'),
              onError: (errors) => {
                const message = Object.values(errors).flat().join(' ');
                toast.error(message || 'Failed to update product');
              },
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
