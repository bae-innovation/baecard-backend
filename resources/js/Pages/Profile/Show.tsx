import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import { PROFILE_TEMPLATES } from '@/features/profile/templates';
import { getProfileTheme } from '@/features/profile/templates/theme-tokens';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';
import { cn } from '@/lib/utils';

type ProfileShowProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocialLink[];
};

export default function ProfileShow({
  card,
  user,
  social_links,
}: ProfileShowProps) {
  const templateId = user.active_template ?? 1;
  const ActiveTemplate =
    PROFILE_TEMPLATES[templateId as keyof typeof PROFILE_TEMPLATES] ?? PROFILE_TEMPLATES[1];
  const theme = getProfileTheme(templateId);

  return (
    <div
      className={cn(
        'min-h-svh w-full',
        theme.mode === 'dark' ? 'bg-[#0a0a0a]' : 'bg-stone-200',
      )}
    >
      {/* App-like phone column: full width on mobile, centered frame on larger screens */}
      <div
        className={cn(
          'mx-auto min-h-svh w-full max-w-md overflow-hidden sm:max-w-[430px]',
          'sm:shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_80px_rgba(0,0,0,0.55)]',
        )}
      >
        <ActiveTemplate card={card} user={user} social_links={social_links} />
      </div>
    </div>
  );
}
