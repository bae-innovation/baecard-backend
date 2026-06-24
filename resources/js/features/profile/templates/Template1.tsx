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
import type { ProfileTemplateProps } from '@/features/profile/templates/profile-template-types';

export function Template1({
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
        'min-h-svh bg-[#f5efe6] text-stone-900',
        isPreview && 'min-h-0 rounded-[2rem] border shadow-xl',
      )}
    >
      <ProfileCover coverUrl={user.cover_image_url} show={sections.showCover} />
      <div className="mx-auto max-w-lg px-4 pb-10 pt-6">
        <div className="mb-6 flex items-end gap-4">
          <ProfileAvatar name={user.name} avatarUrl={user.avatar_url} className="-mt-12" />
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
      </div>
    </div>
  );
}
