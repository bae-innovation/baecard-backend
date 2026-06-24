import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';
import { PROFILE_TEMPLATES } from '@/features/profile/templates';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';

type ProfileShowProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocial[];
  services: ProfileService[];
};

export default function ProfileShow({
  card,
  user,
  social_links,
  services,
}: ProfileShowProps) {
  const templateId = user.active_template ?? 1;
  const ActiveTemplate =
    PROFILE_TEMPLATES[templateId as keyof typeof PROFILE_TEMPLATES] ?? PROFILE_TEMPLATES[1];

  return (
    <ActiveTemplate
      card={card}
      user={user}
      social_links={social_links}
      services={services}
    />
  );
}
