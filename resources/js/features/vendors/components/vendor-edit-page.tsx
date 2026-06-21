import { router, useForm } from '@inertiajs/react';
import { Store } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { VendorForm } from '@/features/vendors/components/vendor-form';
import type { Vendor } from '@/features/vendors/schemas/vendor.schema';
import type { VendorFormValues } from '@/features/vendors/schemas/vendor.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type VendorEditPageProps = {
  vendor: Vendor;
};

export function VendorEditPage({ vendor }: VendorEditPageProps) {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/vendors"
      backLabel="Back to Vendors"
      title="Edit Vendor"
      description={vendor.name}
      icon={Store}
    >
      <VendorForm
        key={vendor.id}
        mode="edit"
        variant="page"
        vendor={vendor}
        isSubmitting={processing}
        onCancel={() => router.visit('/vendors')}
        onSubmit={async (values: VendorFormValues, image?: File | null) => {
          setProcessing(true);
          router.post(
            `/vendors/${vendor.id}`,
            objectToFormData(values as Record<string, unknown>, { image }, 'PUT'),
            {
              forceFormData: true,
              onSuccess: () => showMutationSuccess('Vendor updated'),
              onError: () => showMutationError(null, 'Failed to update vendor'),
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
