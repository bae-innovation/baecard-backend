import type { ReactNode } from 'react';

import { ProfileContentPage } from '@/features/profile/components/profile-content-page';
import type { ProfileContent } from '@/features/profile/schemas/profile-content.schema';

import PortalLayout from '@/Layouts/PortalLayout';

type ContentPageProps = {
  profile?: ProfileContent;
};

export default function Content({ profile }: ContentPageProps) {
  return <ProfileContentPage profile={profile} />;
}

Content.layout = (page: ReactNode) => <PortalLayout>{page}</PortalLayout>;
