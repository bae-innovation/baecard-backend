import { router } from '@inertiajs/react';
import { Check, LayoutTemplate, Loader2, Upload } from 'lucide-react';
import * as React from 'react';

import { FormSection } from '@/components/shared/form-section';
import { PageTitle } from '@/components/shared/page-title';
import { Button } from '@/components/ui/button';
import { VisibilitySettingsForm } from '@/features/profile/components/visibility-settings-form';
import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';
import type { ProfileVisibility } from '@/features/profile/schemas/profile-visibility.schema';
import {
  PROFILE_TEMPLATES,
  TEMPLATE_OPTIONS,
} from '@/features/profile/templates';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { objectToFormData } from '@/lib/object-to-form-data';

type TemplateManagementPageProps = {
  template_id: number;
  active_template: number;
  profile_visibility: ProfileVisibility;
  template_settings: Record<string, { cover_image?: string | null }>;
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocial[];
  services: ProfileService[];
};

export function TemplateManagementPage({
  template_id,
  active_template,
  profile_visibility,
  template_settings,
  card,
  user,
  social_links,
  services,
}: TemplateManagementPageProps) {
  const [activating, setActivating] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const templateMeta = TEMPLATE_OPTIONS.find((item) => item.id === template_id) ?? TEMPLATE_OPTIONS[0];
  const ActiveTemplate = PROFILE_TEMPLATES[template_id as keyof typeof PROFILE_TEMPLATES] ?? PROFILE_TEMPLATES[1];
  const coverUrl = user.cover_image_url;

  const previewUser: PublicProfileUser = {
    ...user,
    active_template: template_id,
    cover_image_url: coverUrl ?? null,
  };

  const handleActivate = () => {
    setActivating(true);
    router.post(
      `/profile/templates/${template_id}/activate`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => showMutationSuccess('Template activated'),
        onError: () => showMutationError(null, 'Failed to activate template'),
        onFinish: () => setActivating(false),
      },
    );
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    router.post(
      `/profile/templates/${template_id}/cover`,
      objectToFormData({ cover_image: file }),
      {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => showMutationSuccess('Cover image updated'),
        onError: () => showMutationError(null, 'Failed to upload cover image'),
        onFinish: () => setUploading(false),
      },
    );
  };

  return (
    <div className="space-y-6 py-4">
      <PageTitle
        title={templateMeta.title}
        description={templateMeta.description}
        icon={LayoutTemplate}
        color="violet"
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <FormSection title="Live preview" description="How your public card will look.">
          <div className="mx-auto w-full max-w-sm overflow-hidden rounded-[2rem] border bg-muted/20 shadow-xl">
            <div className="max-h-[720px] overflow-y-auto">
              <ActiveTemplate
                card={card}
                user={previewUser}
                social_links={social_links}
                services={services}
                isPreview
              />
            </div>
          </div>
        </FormSection>

        <div className="space-y-6">
          <FormSection title="Template actions" description="Activate this design for your public link.">
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={handleActivate}
                disabled={activating || active_template === template_id}
              >
                {activating ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : active_template === template_id ? (
                  <Check className="mr-2 size-4" />
                ) : null}
                {active_template === template_id ? 'Active template' : 'Activate template'}
              </Button>
            </div>
          </FormSection>

          <FormSection
            title="Cover image"
            description="Upload a cover image for this template only."
          >
            {coverUrl ? (
              <img
                src={coverUrl.startsWith('http') ? coverUrl : coverUrl}
                alt="Cover preview"
                className="mb-4 h-32 w-full rounded-xl object-cover"
              />
            ) : null}
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium">
              {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
              Upload cover
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          </FormSection>

          <VisibilitySettingsForm profile_visibility={profile_visibility} />
        </div>
      </div>
    </div>
  );
}
