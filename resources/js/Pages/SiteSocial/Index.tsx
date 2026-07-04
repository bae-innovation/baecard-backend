import type { ReactNode } from 'react';

import { SiteSocialPage } from '@/features/site-social/components/site-social-page';
import type { SiteSocialLink } from '@/features/site-social/schemas/site-social.schema';
import DashboardLayout from '@/Layouts/DashboardLayout';
import type { LaravelPaginator } from '@/types/inertia';

export default function Index({
  siteSocialLinks,
}: {
  siteSocialLinks: LaravelPaginator<SiteSocialLink>;
}) {
  return <SiteSocialPage siteSocialLinks={siteSocialLinks} />;
}

Index.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
