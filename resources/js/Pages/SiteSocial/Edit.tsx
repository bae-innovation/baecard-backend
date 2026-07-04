import type { ReactNode } from 'react';

import { SiteSocialEditPage } from '@/features/site-social/components/site-social-edit-page';
import type { SiteSocialLink } from '@/features/site-social/schemas/site-social.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Edit({
  siteSocialLink,
  platforms,
}: {
  siteSocialLink: SiteSocialLink;
  platforms?: readonly string[];
}) {
  return <SiteSocialEditPage siteSocialLink={siteSocialLink} platforms={platforms} />;
}

Edit.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
