import { ProfileContentForm } from '@/features/profile/components/profile-content-page';
import type { ProfileContent } from '@/features/profile/schemas/profile-content.schema';

type ProfileContentAppPageProps = {
  profile?: ProfileContent;
};

export function ProfileContentAppPage({ profile }: ProfileContentAppPageProps) {
  return <ProfileContentForm profile={profile} variant="owner-app" />;
}
