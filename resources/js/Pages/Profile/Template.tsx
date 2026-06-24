import type { ReactNode } from 'react';

import { TemplateManagementPage } from '@/features/profile/components/template-management-page';
import type { PublicProfileCard, PublicProfileUser } from '@/features/cards/schemas/card-code.schema';
import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';
import type { ProfileVisibility } from '@/features/profile/schemas/profile-visibility.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type TemplatePageProps = {
  template_id: number;
  active_template: number;
  profile_visibility: ProfileVisibility;
  template_settings: Record<string, { cover_image?: string | null }>;
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocial[];
  services: ProfileService[];
};

export default function Template(props: TemplatePageProps) {
  return <TemplateManagementPage {...props} />;
}

Template.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
