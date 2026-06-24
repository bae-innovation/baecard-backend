import { cn } from '@/lib/utils';

import {
  ProfileAvatar,
  ProfileContactList,
  ProfileCover,
  ProfileServicesSection,
  ProfileSocialGrid,
  useProfileSections,
} from '@/features/profile/templates/profile-template-sections';
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';

export function Template3({
  card,
  user,
  social_links,
  services,
  isPreview,
}: ProfileTemplateProps) {
  const sections = useProfileSections({ card, user, social_links, services });

  return (
    <div
      className={cn(
        'min-h-svh bg-slate-100 text-slate-900',
        isPreview && 'min-h-0 rounded-[2rem] border shadow-xl',
      )}
    >
      <div className="border-b bg-white px-4 py-3 text-sm font-semibold tracking-wide">
        BAE CARD™
      </div>

      <ProfileCover coverUrl={user.cover_image_url} show={sections.showCover} className="h-36" />

      <div className="mx-auto max-w-lg px-4 pb-10">
        <div className="-mt-12 mb-6 flex flex-col items-center text-center">
          <ProfileAvatar name={user.name} avatarUrl={user.avatar_url} />
          <h1 className="mt-4 text-2xl font-bold">{user.name}</h1>
          {user.job_title ? (
            <p className="text-sm text-muted-foreground">
              {user.job_title}
              {user.company ? ` at ${user.company}` : ''}
            </p>
          ) : null}
        </div>

        {sections.showBio ? (
          <p className="mb-6 text-center text-sm leading-relaxed text-muted-foreground">{user.bio}</p>
        ) : null}

        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <ProfileSocialGrid links={social_links} show={sections.showSocial} variant="light" />
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm">
            <ProfileContactList
              user={user}
              links={social_links}
              showPhones={sections.showPhones}
              showEmails={sections.showEmails}
              variant="light"
            />
          </div>

          <ProfileServicesSection services={services} show={sections.showServices} variant="light" />
        </div>
      </div>
    </div>
  );
}
