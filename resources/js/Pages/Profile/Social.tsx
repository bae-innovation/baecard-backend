import type { ReactNode } from 'react';

import { SocialManagementPage } from '@/features/profile/components/social-management-page';
import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type SocialPageProps = {
  social_links: ProfileSocial[];
};

export default function Social({ social_links }: SocialPageProps) {
  return <SocialManagementPage social_links={social_links} />;
}

Social.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
