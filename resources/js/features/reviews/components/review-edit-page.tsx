import { router, useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { ReviewForm } from '@/features/reviews/components/review-form';
import type { Review } from '@/features/reviews/schemas/review.schema';
import type { ReviewFormValues } from '@/features/reviews/schemas/review.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type ReviewEditPageProps = {
  review: Review;
};

export function ReviewEditPage({ review }: ReviewEditPageProps) {
  const [processing, setProcessing] = React.useState(false);
  useForm({});

  return (
    <FormPageShell
      backTo="/reviews"
      backLabel="Back to Reviews"
      title="Edit Review"
      description={review.name}
      icon={Star}
    >
      <ReviewForm
        key={review.id}
        mode="edit"
        variant="page"
        review={review}
        isSubmitting={processing}
        onCancel={() => router.visit('/reviews')}
        onSubmit={async (values: ReviewFormValues) => {
          setProcessing(true);
          router.put(`/reviews/${review.id}`, values, {
            onSuccess: () => showMutationSuccess('Review updated'),
            onError: () => showMutationError(null, 'Failed to update review'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
