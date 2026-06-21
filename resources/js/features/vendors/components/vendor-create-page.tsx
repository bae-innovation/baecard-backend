import { router, useForm } from '@inertiajs/react';
import { Store } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { VendorForm } from '@/features/vendors/components/vendor-form';
import type { VendorFormValues } from '@/features/vendors/schemas/vendor.schema';
import { objectToFormData } from '@/lib/object-to-form-data';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function VendorCreatePage() {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/vendors"
      backLabel="Back to Vendors"
      title="Create Vendor"
      description="Add a new vendor to your catalog"
      icon={Store}
    >
      <VendorForm
        mode="create"
        variant="page"
        isSubmitting={processing}
        onCancel={() => router.visit('/vendors')}
        onSubmit={async (values: VendorFormValues, image?: File | null) => {
          setProcessing(true);
          router.post(
            '/vendors',
            objectToFormData(values as Record<string, unknown>, { image }),
            {
              forceFormData: true,
              onSuccess: () => showMutationSuccess('Vendor created'),
              onError: () => showMutationError(null, 'Failed to create vendor'),
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
