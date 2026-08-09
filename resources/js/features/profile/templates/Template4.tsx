import { cn } from '@/lib/utils';

import {
  ProfileAvatar,
  ProfileContactList,
  ProfileCover,
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

export function Template4({
  card,
  user,
  social_links,
  services,
  isPreview,
}: ProfileTemplateProps) {
  const sections = useProfileSections({ card, user, social_links, services });
  const avatarBorder = profileAvatarBorderClass('modern-dark');

  return (
    <div
      className={cn(
        isPreview && 'min-h-0 rounded-[2rem] border border-white/10 shadow-xl overflow-hidden',
      )}
    >
      <div className="border-b border-white/10 bg-zinc-950 px-4 py-3 text-sm font-semibold tracking-wide text-white">
        BAE CARD™
      </div>

      <ProfileCover coverUrl={user.cover_image_url} show={sections.showCover} className="h-36" />

      <ProfilePageShell
        hasCover={sections.showCover}
        variant="modern-dark"
        className={cn(isPreview && 'min-h-0')}
      >
        <div
          className={cn(
            'mb-6 flex flex-col items-center text-center',
            sections.showCover ? '-mt-12' : 'mt-2',
          )}
        >
          <ProfileAvatar
            name={user.name}
            avatarUrl={user.avatar_url}
            borderClassName={avatarBorder}
            className={profileAvatarOverlapClass(sections.showCover)}
          />
          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          {user.job_title ? (
            <p className="text-sm text-white/70">
              {user.job_title}
              {user.company ? ` at ${user.company}` : ''}
            </p>
          ) : null}
        </div>

        {sections.showBio ? (
          <p className="mb-6 text-center text-sm leading-relaxed text-white/70">{user.bio}</p>
        ) : null}

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <ProfileSocialGrid links={social_links} show={sections.showSocial} variant="dark" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <ProfileContactList
              user={user}
              links={social_links}
              showPhones={sections.showPhones}
              showEmails={sections.showEmails}
              variant="dark"
            />
          </div>

          <ProfileServicesSection services={services} show={sections.showServices} variant="dark" />
        </div>
      </ProfilePageShell>
    </div>
  );
}
