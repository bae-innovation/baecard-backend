import { router } from '@inertiajs/react';

import { objectToFormData } from '@/lib/object-to-form-data';

export type SettingsPageGroup = 'general' | 'appearance';

export type SettingsDataGroup =
  | 'general'
  | 'branding'
  | 'business'
  | 'social'
  | 'email';

export type UpdatableSettingsGroup = SettingsDataGroup;

type SettingsCallbacks = {
  onSuccess?: () => void;
  onError?: () => void;
  onFinish?: () => void;
};

export function visitSettingsGroup(
  group: SettingsPageGroup,
  callbacks?: Pick<SettingsCallbacks, 'onFinish'>,
) {
  router.get(`/settings/${group}`, {}, {
    preserveScroll: true,
    onFinish: callbacks?.onFinish,
  });
}

export async function fetchSettingsGroup(group: SettingsDataGroup): Promise<unknown> {
  const response = await fetch(`/settings/${group}`, {
    headers: {
      Accept: 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    },
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${group} settings`);
  }

  const payload = await response.json();

  return payload.data;
}

export function updateSettingsGroup(
  group: UpdatableSettingsGroup,
  values: Record<string, unknown>,
  files?: Record<string, File | null | undefined>,
  callbacks?: SettingsCallbacks,
) {
  router.post(
    `/settings/${group}`,
    objectToFormData(values, files, 'PATCH'),
    {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError,
      onFinish: callbacks?.onFinish,
    },
  );
}
