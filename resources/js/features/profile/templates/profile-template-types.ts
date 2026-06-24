import type { ProfileSocial } from '@/features/profile/schemas/profile-social.schema';
import type { ProfileService } from '@/features/profile/schemas/profile-service.schema';
import type {
  ProfileVisibility,
} from '@/features/profile/schemas/profile-visibility.schema';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';

export type ProfileTemplateProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocial[];
  services: ProfileService[];
  isPreview?: boolean;
};

export function resolveVisibility(
  visibility?: Partial<ProfileVisibility> | null,
): ProfileVisibility {
  return {
    bio: visibility?.bio ?? true,
    phones: visibility?.phones ?? true,
    emails: visibility?.emails ?? true,
    social: visibility?.social ?? true,
    services: visibility?.services ?? true,
    cover: visibility?.cover ?? true,
    qr: visibility?.qr ?? true,
  };
}

export function formatPrice(price?: number | string | null): string {
  if (price == null || price === '') {
    return '';
  }

  const numeric = typeof price === 'string' ? Number(price) : price;
  if (Number.isNaN(numeric)) {
    return String(price);
  }

  return `${numeric.toLocaleString()} ৳`;
}
