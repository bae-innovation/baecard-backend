import type { ReactNode } from 'react';

import type { SettingsPageGroup } from '@/features/settings/api/settings.api';
import { SettingsPage } from '@/features/settings/components/settings-page';
import type { AppSettings } from '@/features/settings/schemas/settings.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type SettingsIndexProps = {
  group: SettingsPageGroup;
  data?: AppSettings | null;
};

export default function Index({ group, data }: SettingsIndexProps) {
  return <SettingsPage group={group} data={data} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
