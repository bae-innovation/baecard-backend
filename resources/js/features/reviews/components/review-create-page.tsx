import { router, useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { ReviewForm } from '@/features/reviews/components/review-form';
import type { ReviewFormValues } from '@/features/reviews/schemas/review.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function ReviewCreatePage() {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/reviews"
      backLabel="Back to Reviews"
      title="Create Review"
      description="Add a new customer review"
      icon={Star}
    >
      <ReviewForm
        mode="create"
        variant="page"
        isSubmitting={processing}
        onCancel={() => router.visit('/reviews')}
        onSubmit={async (values: ReviewFormValues) => {
          setProcessing(true);
          router.post('/reviews', values, {
            onSuccess: () => showMutationSuccess('Review created'),
            onError: () => showMutationError(null, 'Failed to create review'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
