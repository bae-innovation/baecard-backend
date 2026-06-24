import { router } from '@inertiajs/react';
import { Reorder } from 'framer-motion';
import { GripVertical, Pencil, Plus, Share2, Trash2 } from 'lucide-react';
import * as React from 'react';

import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SocialFormDialog } from '@/features/profile/components/social-form-dialog';
import { buildPlatformUrl } from '@/features/profile/lib/platform-url-builder';
import {
  PLATFORM_LABELS,
  type ProfileSocial,
  type ProfileSocialFormValues,
} from '@/features/profile/schemas/profile-social.schema';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

type SocialManagementPageProps = {
  social_links: ProfileSocial[];
};

export function SocialManagementPage({ social_links }: SocialManagementPageProps) {
  const [items, setItems] = React.useState(social_links);
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<'create' | 'edit'>('create');
  const [selected, setSelected] = React.useState<ProfileSocial | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setItems(social_links);
  }, [social_links]);

  const openCreate = () => {
    setFormMode('create');
    setSelected(null);
    setFormOpen(true);
  };

  const openEdit = (social: ProfileSocial) => {
    setFormMode('edit');
    setSelected(social);
    setFormOpen(true);
  };

  const handleReorder = (nextItems: ProfileSocial[]) => {
    setItems(nextItems);
    router.post(
      '/profile/social/reorder',
      {
        items: nextItems.map((item, index) => ({
          id: item.id,
          sort_order: index,
        })),
      },
      {
        preserveScroll: true,
        only: ['social_links'],
        onError: () => showMutationError(null, 'Failed to reorder social links'),
      },
    );
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageTitle
          title="Social Links"
          description="Manage your social profiles, phone numbers, and email addresses for your public card."
          icon={Share2}
          color="blue"
        />
        <Button onClick={openCreate}>
          <Plus className="mr-2 size-4" />
          Add link
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No social links yet. Add your first link to show it on your public card.
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-3">
          {items.map((social) => {
            const href = buildPlatformUrl(social.platform, social.platform_value, social.url);

            return (
              <Reorder.Item
                key={social.id}
                value={social}
                className="flex items-center gap-3 rounded-xl border bg-card p-4 shadow-sm"
              >
                <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{PLATFORM_LABELS[social.platform]}</Badge>
                    {social.is_primary ? <Badge>Primary</Badge> : null}
                  </div>
                  <p className="mt-1 font-medium">{social.platform_value}</p>
                  {social.label ? (
                    <p className="text-sm text-muted-foreground">{social.label}</p>
                  ) : null}
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-xs text-primary hover:underline"
                  >
                    {href}
                  </a>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button type="button" variant="outline" size="icon" onClick={() => openEdit(social)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      router.delete(`/profile/social/${social.id}`, {
                        preserveScroll: true,
                        only: ['social_links'],
                        onSuccess: () => showMutationSuccess('Social link removed'),
                        onError: () => showMutationError(null, 'Failed to delete social link'),
                      });
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      )}

      <SocialFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        mode={formMode}
        social={selected}
        isSubmitting={isSubmitting}
        onSubmit={async (values: ProfileSocialFormValues) => {
          setIsSubmitting(true);

          if (formMode === 'create') {
            router.post('/profile/social', values, {
              preserveScroll: true,
              only: ['social_links'],
              onSuccess: () => {
                showMutationSuccess('Social link added');
                setFormOpen(false);
              },
              onError: () => showMutationError(null, 'Failed to add social link'),
              onFinish: () => setIsSubmitting(false),
            });
            return;
          }

          if (!selected) {
            setIsSubmitting(false);
            return;
          }

          router.put(`/profile/social/${selected.id}`, values, {
            preserveScroll: true,
            only: ['social_links'],
            onSuccess: () => {
              showMutationSuccess('Social link updated');
              setFormOpen(false);
              setSelected(null);
            },
            onError: () => showMutationError(null, 'Failed to update social link'),
            onFinish: () => setIsSubmitting(false),
          });
        }}
      />
    </div>
  );
}
