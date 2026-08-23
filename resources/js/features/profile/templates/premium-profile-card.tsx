import {
  ProfileAvatar,
  ProfileContactCards,
  ProfileCover,
  ProfileProfessionalCard,
  ProfilePublicActions,
  ProfileSocialSlider,
  useProfileSections,
  type ProfileManagementControls,
} from '@/features/profile/templates/profile-template-sections';
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';
import { getProfileTheme } from '@/features/profile/templates/theme-tokens';
import { cn } from '@/lib/utils';

export function PremiumProfileCard({
  card,
  user,
  social_links,
  isPreview,
  compactPreview,
  density = 'default',
  themeId,
  management,
}: ProfileTemplateProps & {
  themeId: number;
}) {
  const theme = getProfileTheme(themeId);
  const sections = useProfileSections({ card, user, social_links });
  const managementControls = management as ProfileManagementControls | undefined;
  const isLive = !isPreview && !managementControls;
  const isCentered = theme.avatarAlign === 'center';

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden',
        theme.shell,
        isPreview ? 'min-h-0' : 'min-h-svh',
        isLive && 'pb-[max(1.5rem,env(safe-area-inset-bottom))]',
      )}
    >
      <ProfileCover
        coverUrl={user.cover_image_url}
        show={sections.showCover}
        theme={theme}
        management={managementControls}
        className={cn(theme.grayscaleCover && '[&_img]:grayscale')}
      />

      <div
        className={cn(
          'relative mx-auto w-full max-w-md',
          isPreview && compactPreview ? 'px-0 pb-4' : 'px-4 pb-8 sm:px-5',
          theme.waveBody && cn(theme.bodySurface, '-mt-10 rounded-t-[2.75rem] pt-2'),
        )}
      >
        <div
          className={cn(
            'flex',
            isCentered
              ? cn(
                  'flex-col items-center text-center',
                  theme.waveBody ? '-mt-16 sm:-mt-20' : '-mt-12 sm:-mt-14',
                )
              : cn('flex-col items-start text-left', '-mt-12 sm:-mt-14'),
          )}
        >
          <ProfileAvatar
            name={user.name}
            avatarUrl={user.avatar_url}
            borderClassName={theme.avatarBorder}
            shape={theme.avatarShape}
          />

          <h1
            className={cn(
              'mt-3.5 max-w-full text-[1.65rem] font-bold leading-tight tracking-tight sm:text-3xl',
              isCentered ? 'px-2' : 'pr-2',
              theme.title,
            )}
          >
            {user.name}
          </h1>

          {sections.showBio ? (
            <p
              className={cn(
                'mt-3 w-full max-w-sm leading-relaxed',
                density === 'comfortable' ? 'text-sm' : 'text-[13px] sm:text-sm',
                isCentered ? 'text-left' : '',
                theme.bio,
              )}
            >
              {user.bio}
            </p>
          ) : null}
        </div>

        <div className="mt-5 space-y-4">
          <ProfileSocialSlider links={social_links} show={sections.showSocial} theme={theme} />

          <div className={cn('space-y-3', theme.contactStack || undefined)}>
            <ProfileProfessionalCard user={user} theme={theme} density={density} />

            <ProfileContactCards
              user={user}
              showPhones={sections.showPhones}
              showEmails={sections.showEmails}
              showAddresses={sections.showAddresses}
              theme={theme}
              density={density}
            />
          </div>

          {isPreview ? <ProfilePublicActions user={user} theme={theme} /> : null}

          <p className={cn('pt-1 text-center text-[11px]', theme.footer)}>Made by BAE Card™</p>
        </div>
      </div>
    </div>
  );
}
