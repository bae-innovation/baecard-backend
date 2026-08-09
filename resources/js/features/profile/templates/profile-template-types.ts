import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';

export type ProfileTemplateProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocialLink[];
  isPreview?: boolean;
  management?: {
    isActive: boolean;
    activating?: boolean;
    onActivateChange: (active: boolean) => void;
  };
};
