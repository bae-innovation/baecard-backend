import { router } from '@inertiajs/react';
import { Share2 } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { SiteSocialForm } from '@/features/site-social/components/site-social-form';
import {
  serializeSiteSocialFormPayload,
  type SiteSocialFormValues,
} from '@/features/site-social/schemas/site-social.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type SiteSocialCreatePageProps = {
  platforms?: readonly string[];
};

export function SiteSocialCreatePage({ platforms }: SiteSocialCreatePageProps) {
  const [processing, setProcessing] = React.useState(false);

  return (
    <FormPageShell
      backTo="/admin/site-social"
      backLabel="Back to Social Management"
      title="Create Social Link"
      description="Add a new social profile or contact link for the website"
      icon={Share2}
      color="blue"
    >
      <SiteSocialForm
        mode="create"
        platforms={platforms}
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/site-social')}
        onSubmit={async (values: SiteSocialFormValues) => {
          setProcessing(true);
          router.post('/admin/site-social', serializeSiteSocialFormPayload(values), {
            onSuccess: () => showMutationSuccess('Social link created'),
            onError: () => showMutationError(null, 'Failed to create social link'),
            onFinish: () => setProcessing(false),
          });
        }}
      />
    </FormPageShell>
  );
}
