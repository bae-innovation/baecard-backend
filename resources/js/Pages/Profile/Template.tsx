import type { ReactNode } from 'react';

import { TemplateManagementPage } from '@/features/profile/components/template-management-page';
import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';

import DashboardLayout from '@/Layouts/DashboardLayout';

type TemplatePageProps = {
  active_template: number;
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocialLink[];
};

export default function Template(props: TemplatePageProps) {
  return <TemplateManagementPage {...props} />;
}

Template.layout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;
