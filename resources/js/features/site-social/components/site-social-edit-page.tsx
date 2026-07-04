import { router } from '@inertiajs/react';
import { Share2 } from 'lucide-react';
import * as React from 'react';

import { FormPageShell } from '@/components/shared/form-page-shell';
import { SiteSocialForm } from '@/features/site-social/components/site-social-form';
import {
  serializeSiteSocialFormPayload,
  type SiteSocialFormValues,
  type SiteSocialLink,
} from '@/features/site-social/schemas/site-social.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type SiteSocialEditPageProps = {
  siteSocialLink: SiteSocialLink;
  platforms?: readonly string[];
};

export function SiteSocialEditPage({ siteSocialLink, platforms }: SiteSocialEditPageProps) {
  const [processing, setProcessing] = React.useState(false);

  return (
    <FormPageShell
      backTo="/admin/site-social"
      backLabel="Back to Social Management"
      title="Edit Social Link"
      description="Update platform, link value, or floating visibility"
      icon={Share2}
      color="blue"
    >
      <SiteSocialForm
        mode="edit"
        siteSocialLink={siteSocialLink}
        platforms={platforms}
        isSubmitting={processing}
        onCancel={() => router.visit('/admin/site-social')}
        onSubmit={async (values: SiteSocialFormValues) => {
          setProcessing(true);
          router.put(
            `/admin/site-social/${siteSocialLink.id}`,
            serializeSiteSocialFormPayload(values),
            {
              onSuccess: () => showMutationSuccess('Social link updated'),
              onError: () => showMutationError(null, 'Failed to update social link'),
              onFinish: () => setProcessing(false),
            },
          );
        }}
      />
    </FormPageShell>
  );
}
