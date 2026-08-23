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
  /** Tighter layout when preview is embedded in the owner app theme picker. */
  compactPreview?: boolean;
  /** Larger labels and values when previewing inside the owner PWA. */
  density?: 'default' | 'comfortable';
  management?: {
    isActive: boolean;
    activating?: boolean;
    onActivateChange: (active: boolean) => void;
  };
};
