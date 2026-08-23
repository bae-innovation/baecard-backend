import { router } from '@inertiajs/react';
import { LayoutTemplate } from 'lucide-react';
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
import { OwnerAppPageHeader } from '@/owner/components/owner-app-page-header';
import { useOwnerAppShell } from '@/owner/hooks/use-owner-app-shell';
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
  const isOwnerApp = useOwnerAppShell();
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
    <div
      className={cn(
        'mx-auto w-full',
        isOwnerApp
          ? 'flex flex-col gap-4 px-4 pb-4'
          : 'max-w-6xl space-y-8 py-4',
      )}
    >
      {isOwnerApp ? (
        <OwnerAppPageHeader
          title="Browse themes"
          description="Preview templates and pick the one visitors see on your card."
          icon={LayoutTemplate}
        />
      ) : (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Profile themes
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Choose your public card theme</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Preview all available templates and activate the one you want visitors to see on your Bae
            Card.
          </p>
        </div>
      )}

      <div className={cn('grid', isOwnerApp ? 'gap-4' : 'gap-6 xl:grid-cols-2')}>
        {TEMPLATE_OPTIONS.map((option) => {
          const TemplateComponent = PROFILE_TEMPLATES[option.id];
          const theme = getProfileTheme(option.id);
          const optionTheme = PROFILE_THEMES[option.id];
          const isActive = active_template === option.id;

          return (
            <section
              key={option.id}
              className={cn(
                'overflow-hidden rounded-2xl border bg-card shadow-sm',
                isOwnerApp ? 'bg-card' : 'rounded-[1.75rem] bg-card/70 shadow-sm backdrop-blur',
                isActive ? 'border-sky-500/70 ring-1 ring-sky-500/30' : 'border-border',
              )}
            >
              <div
                className={cn(
                  'flex items-center justify-between gap-3 border-b',
                  isOwnerApp ? 'px-3 py-2.5' : 'px-4 py-3',
                )}
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{option.title}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <button
                  type="button"
                  disabled={isActive || activatingId === option.id}
                  onClick={() => handleActivate(option.id)}
                  className={cn(
                    'shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition',
                    isActive
                      ? 'bg-sky-500/15 text-sky-600'
                      : 'bg-muted text-foreground hover:bg-sky-500/10 hover:text-sky-600',
                  )}
                >
                  {isActive ? 'Active' : activatingId === option.id ? 'Activating…' : 'Activate'}
                </button>
              </div>

              <div className={cn(isOwnerApp ? 'p-2' : 'p-3')}>
                <div
                  className={cn(
                    'mb-2 h-2 rounded-full',
                    optionTheme.mode === 'dark'
                      ? 'bg-gradient-to-r from-zinc-700 to-sky-700'
                      : 'bg-gradient-to-r from-amber-200 to-sky-300',
                  )}
                />
                <div
                  className={cn(
                    'overflow-hidden rounded-2xl border',
                    theme.mode === 'dark' && 'border-white/10',
                  )}
                >
                  <TemplateComponent
                    card={card}
                    user={{ ...user, active_template: option.id }}
                    social_links={social_links}
                    isPreview
                    compactPreview={isOwnerApp}
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
