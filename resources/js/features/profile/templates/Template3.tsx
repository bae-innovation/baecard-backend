import { PremiumProfileCard } from '@/features/profile/templates/premium-profile-card';
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';

export function Template3(props: ProfileTemplateProps) {
  return <PremiumProfileCard {...props} themeId={3} />;
}
