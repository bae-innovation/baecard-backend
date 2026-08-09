import { router } from '@inertiajs/react';
import * as React from 'react';

import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import {
  PROFILE_TEMPLATES,
  TEMPLATE_OPTIONS,
} from '@/features/profile/templates';
import { PROFILE_THEMES, getProfileTheme } from '@/features/profile/templates/theme-tokens';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';
import { cn } from '@/lib/utils';

type TemplateManagementPageProps = {
  active_template: number;
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocialLink[];
};

export function TemplateManagementPage({
  active_template,
  card,
  user,
  social_links,
}: TemplateManagementPageProps) {
  const [activatingId, setActivatingId] = React.useState<number | null>(null);

  const handleActivate = (templateId: number) => {
    if (active_template === templateId) {
      return;
    }

    setActivatingId(templateId);
    router.post(
      `/profile/templates/${templateId}/activate`,
      {},
      {
        preserveScroll: true,
        onSuccess: () => showMutationSuccess('Theme activated'),
        onError: () => showMutationError(null, 'Failed to activate theme'),
        onFinish: () => setActivatingId(null),
      },
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 py-4">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Profile themes
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Choose your public card theme</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Preview all available templates and activate the one you want visitors to see on your Bae Card.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {TEMPLATE_OPTIONS.map((option) => {
          const TemplateComponent = PROFILE_TEMPLATES[option.id];
          const theme = getProfileTheme(option.id);
          const optionTheme = PROFILE_THEMES[option.id];
          const isActive = active_template === option.id;

          return (
            <section
              key={option.id}
              className={cn(
                'overflow-hidden rounded-[1.75rem] border bg-card/70 shadow-sm backdrop-blur',
                isActive ? 'border-sky-500/70 ring-1 ring-sky-500/30' : 'border-border',
              )}
            >
              <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{option.title}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <button
                  type="button"
                  disabled={isActive || activatingId === option.id}
                  onClick={() => handleActivate(option.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-semibold transition',
                    isActive
                      ? 'bg-sky-500/15 text-sky-600'
                      : 'bg-muted text-foreground hover:bg-sky-500/10 hover:text-sky-600',
                  )}
                >
                  {isActive ? 'Active' : activatingId === option.id ? 'Activating…' : 'Activate'}
                </button>
              </div>

              <div className="p-3">
                <div
                  className={cn(
                    'mb-3 h-2 rounded-full',
                    optionTheme.mode === 'dark'
                      ? 'bg-gradient-to-r from-zinc-700 to-sky-700'
                      : 'bg-gradient-to-r from-amber-200 to-sky-300',
                  )}
                />
                <div
                  className={cn(
                    'overflow-hidden rounded-[1.5rem] border',
                    theme.mode === 'dark' && 'border-white/10',
                  )}
                >
                  <TemplateComponent
                    card={card}
                    user={{ ...user, active_template: option.id }}
                    social_links={social_links}
                    isPreview
                    management={{
                      isActive,
                      activating: activatingId === option.id,
                      onActivateChange: (active) => {
                        if (active) {
                          handleActivate(option.id);
                        }
                      },
                    }}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
