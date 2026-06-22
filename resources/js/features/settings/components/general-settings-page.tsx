import { usePage } from '@inertiajs/react';
import {
  Building2,
  Globe,
  Mail,
  Palette,
  Share2,
} from 'lucide-react';
import * as React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandingSettingsTab } from '@/features/settings/components/branding-settings-tab';
import { BusinessSettingsTab } from '@/features/settings/components/business-settings-tab';
import { EmailSettingsTab } from '@/features/settings/components/email-settings-tab';
import { GeneralSettingsTab } from '@/features/settings/components/general-settings-tab';
import { SocialSettingsTab } from '@/features/settings/components/social-settings-tab';
import type { AppSettings } from '@/features/settings/schemas/settings.schema';

const GENERAL_TABS = [
  { value: 'site', label: 'Site Info', icon: Globe },
  { value: 'branding', label: 'Branding', icon: Palette },
  { value: 'business', label: 'Business', icon: Building2 },
  { value: 'social', label: 'Social', icon: Share2 },
  { value: 'email', label: 'Email', icon: Mail },
] as const;

type GeneralTabValue = (typeof GENERAL_TABS)[number]['value'];

type GeneralSettingsPageProps = {
  settings: AppSettings;
  defaultTab?: GeneralTabValue;
};

export function GeneralSettingsPage({ settings, defaultTab = 'site' }: GeneralSettingsPageProps) {
  const { url } = usePage();
  const tabFromUrl = React.useMemo(() => {
    const tab = new URL(url, window.location.origin).searchParams.get('tab');
    return GENERAL_TABS.some((item) => item.value === tab) ? (tab as GeneralTabValue) : null;
  }, [url]);
  const [activeTab, setActiveTab] = React.useState<GeneralTabValue>(tabFromUrl ?? defaultTab);

  React.useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  return (
    <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as GeneralTabValue)} className="space-y-6">
      <TabsList className="h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
        {GENERAL_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <Icon className="size-4" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="site" className="mt-0">
        <GeneralSettingsTab settings={settings.general} />
      </TabsContent>
      <TabsContent value="branding" className="mt-0">
        <BrandingSettingsTab settings={settings.branding ?? { primary_color: '#2563eb' }} />
      </TabsContent>
      <TabsContent value="business" className="mt-0">
        <BusinessSettingsTab settings={settings.business} />
      </TabsContent>
      <TabsContent value="social" className="mt-0">
        <SocialSettingsTab settings={settings.social} />
      </TabsContent>
      <TabsContent value="email" className="mt-0">
        <EmailSettingsTab settings={settings.email} />
      </TabsContent>
    </Tabs>
  );
}
