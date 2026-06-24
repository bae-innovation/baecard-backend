import { router } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { FormSection } from '@/components/shared/form-section';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DEFAULT_PROFILE_VISIBILITY,
  VISIBILITY_FIELDS,
  type ProfileVisibility,
} from '@/features/profile/schemas/profile-visibility.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type VisibilitySettingsFormProps = {
  profile_visibility: ProfileVisibility;
};

export function VisibilitySettingsForm({ profile_visibility }: VisibilitySettingsFormProps) {
  const [values, setValues] = React.useState<ProfileVisibility>({
    ...DEFAULT_PROFILE_VISIBILITY,
    ...profile_visibility,
  });
  const [processing, setProcessing] = React.useState(false);

  React.useEffect(() => {
    setValues({
      ...DEFAULT_PROFILE_VISIBILITY,
      ...profile_visibility,
    });
  }, [profile_visibility]);

  const handleSave = () => {
    setProcessing(true);
    router.patch('/profile/visibility', values, {
      preserveScroll: true,
      onSuccess: () => showMutationSuccess('Visibility settings saved'),
      onError: () => showMutationError(null, 'Failed to save visibility settings'),
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <FormSection
      title="Public visibility"
      description="Choose which sections appear on your public card."
    >
      <div className="space-y-3">
        {VISIBILITY_FIELDS.map((field) => (
          <div
            key={field.key}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div>
              <p className="text-sm font-medium">{field.label}</p>
              <p className="text-xs text-muted-foreground">{field.description}</p>
            </div>
            <Switch
              checked={values[field.key]}
              onCheckedChange={(checked) =>
                setValues((current) => ({ ...current, [field.key]: checked }))
              }
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" onClick={handleSave} disabled={processing}>
          {processing ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
          Save visibility
        </Button>
      </div>
    </FormSection>
  );
}
