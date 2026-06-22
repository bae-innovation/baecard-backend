import { Globe, Sparkles, type LucideIcon } from 'lucide-react';

import type { SettingsPageGroup } from '@/features/settings/api/settings.api';

export const SETTINGS_NAV_ITEMS: {
  group: SettingsPageGroup;
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    group: 'general',
    title: 'General',
    description: 'Site, business, social, and email settings',
    icon: Globe,
  },
  {
    group: 'appearance',
    title: 'Appearance',
    description: 'Theme and accent color preferences',
    icon: Sparkles,
  },
];

export function getSettingsNavItem(group: SettingsPageGroup) {
  return SETTINGS_NAV_ITEMS.find((item) => item.group === group) ?? SETTINGS_NAV_ITEMS[0];
}
