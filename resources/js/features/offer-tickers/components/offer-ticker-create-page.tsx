import { router } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { OfferTickerForm } from '@/features/offer-tickers/components/offer-ticker-form';
import {
  serializeOfferTickerFormPayload,
  type OfferTickerFormValues,
} from '@/features/offer-tickers/schemas/offer-ticker.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function OfferTickerCreatePage() {
  const [processing, setProcessing] = React.useState(false);

  return (
    <FormPageShell
      backTo="/admin/offer-tickers"
      backLabel="Back to Offer Tickers"
      title="Create Offer Ticker"
      description="Add a new promo message for the home page marquee"
      icon={Megaphone}
      color="violet"
    >
      <OfferTickerForm
        mode="create"
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/offer-tickers')}
        onSubmit={async (values: OfferTickerFormValues) => {
          setProcessing(true);
          router.post('/admin/offer-tickers', serializeOfferTickerFormPayload(values), {
            onSuccess: () => showMutationSuccess('Offer ticker created'),
            onError: () => showMutationError(null, 'Failed to create offer ticker'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
