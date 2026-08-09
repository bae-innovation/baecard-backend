import { cn } from '@/lib/utils';

import {
  ProfileAvatar,
  ProfileContactList,
  ProfileCover,
  ProfileQrSection,
  ProfileServicesSection,
  ProfileSocialGrid,
  useProfileSections,
} from '@/features/profile/templates/profile-template-sections';
import {
  profileAvatarBorderClass,
  profileAvatarOverlapClass,
  ProfilePageShell,
} from '@/features/profile/templates/profile-page-shell';
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';

export function Template1({
  card,
  user,
  social_links,
  services,
  isPreview,
}: ProfileTemplateProps) {
  const sections = useProfileSections({ card, user, social_links, services });
  const avatarBorder = profileAvatarBorderClass('light');

  return (
    <div
      className={cn(
        isPreview && 'min-h-0 rounded-[2rem] border shadow-xl overflow-hidden',
      )}
    >
      <ProfileCover coverUrl={user.cover_image_url} show={sections.showCover} />
      <ProfilePageShell hasCover={sections.showCover} variant="light" className={cn(isPreview && 'min-h-0')}>
        <div className="mb-6 flex items-end gap-4">
          <ProfileAvatar
            name={user.name}
            avatarUrl={user.avatar_url}
            borderClassName={avatarBorder}
            className={profileAvatarOverlapClass(sections.showCover)}
          />
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.job_title ? (
              <p className="text-sm text-amber-700">
                {user.job_title}
                {user.company ? ` at ${user.company}` : ''}
              </p>
            ) : null}
          </div>
        </div>

        {sections.showBio ? (
          <p className="mb-6 text-sm leading-relaxed text-stone-700">{user.bio}</p>
        ) : null}

        <div className="space-y-8">
          <ProfileSocialGrid links={social_links} show={sections.showSocial} variant="light" />
          <ProfileContactList
            user={user}
            links={social_links}
            showPhones={sections.showPhones}
            showEmails={sections.showEmails}
            variant="light"
          />
          <ProfileServicesSection services={services} show={sections.showServices} variant="light" />
          <ProfileQrSection scanUrl={card.scan_url} show={sections.showQr} variant="light" />
        </div>

        <p className="mt-10 text-center text-xs text-stone-500">Made By BAE Card™</p>
      </ProfilePageShell>
    </div>
  );
}
