import { router } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { OfferTickerForm } from '@/features/offer-tickers/components/offer-ticker-form';
import {
  serializeOfferTickerFormPayload,
  type OfferTicker,
  type OfferTickerFormValues,
} from '@/features/offer-tickers/schemas/offer-ticker.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type OfferTickerEditPageProps = {
  offerTicker: OfferTicker;
};

export function OfferTickerEditPage({ offerTicker }: OfferTickerEditPageProps) {
  const [processing, setProcessing] = React.useState(false);

  return (
    <FormPageShell
      backTo="/admin/offer-tickers"
      backLabel="Back to Offer Tickers"
      title="Edit Offer Ticker"
      description="Update promo message, theme, or visibility"
      icon={Megaphone}
      color="violet"
    >
      <OfferTickerForm
        mode="edit"
        offerTicker={offerTicker}
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/offer-tickers')}
        onSubmit={async (values: OfferTickerFormValues) => {
          setProcessing(true);
          router.put(
            `/admin/offer-tickers/${offerTicker.id}`,
            serializeOfferTickerFormPayload(values),
            {
              onSuccess: () => showMutationSuccess('Offer ticker updated'),
              onError: () => showMutationError(null, 'Failed to update offer ticker'),
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
