import { PageTitle } from '@/components/shared/page-title';
import type { SettingsPageGroup } from '@/features/settings/api/settings.api';
import { AppearanceSettingsPage } from '@/features/settings/components/appearance-settings-page';
import { GeneralSettingsPage } from '@/features/settings/components/general-settings-page';
import { getSettingsNavItem } from '@/features/settings/components/settings-navigation';
import type { AppSettings } from '@/features/settings/schemas/settings.schema';

type SettingsPageProps = {
  group: SettingsPageGroup;
  data?: AppSettings | null;
};

export function SettingsPage({ group, data }: SettingsPageProps) {
  const navItem = getSettingsNavItem(group);

  return (
    <div className="space-y-6 py-4">
      <PageTitle
        title={navItem.title}
        description={navItem.description}
        icon={navItem.icon}
        color="purple"
      />

      <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
        {group === 'general' && data ? <GeneralSettingsPage settings={data} /> : null}
        {group === 'appearance' ? <AppearanceSettingsPage /> : null}
      </div>
    </div>
  );
}
