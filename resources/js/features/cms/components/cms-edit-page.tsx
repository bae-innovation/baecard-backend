import { router } from '@inertiajs/react';
import { ExternalLink, FileEdit, Save } from 'lucide-react';
import * as React from 'react';

import { getCatalogEntry } from '@/features/cms/config/cms-entry-catalog';
import { CmsEntryForm } from '@/features/cms/components/cms-entry-form';
import type { CmsEditPageProps } from '@/features/cms/schemas/cms-entry.schema';
import { FormPageShell } from '@/components/shared/form-page-shell';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { showMutationError, showMutationSuccess } from '@/lib/mutation-toast';

export function CmsEditPage({ key: entryKey, schema, entry, defaults }: CmsEditPageProps) {
  const { hasAbility } = useAuth();
  const canManage = hasAbility('cms.manage');
  const catalog = getCatalogEntry(entryKey);

  const [label, setLabel] = React.useState(entry?.label ?? catalog?.label ?? entryKey);
  const [content, setContent] = React.useState<Record<string, unknown>>(
    entry?.content ?? defaults ?? {},
  );
  const [isPublished, setIsPublished] = React.useState(entry?.is_published ?? true);
  const [saving, setSaving] = React.useState(false);

  function handleSave() {
    if (!canManage) return;

    setSaving(true);
    router.put(
      `/admin/cms/${entryKey}`,
      { label, content, is_published: isPublished },
      {
        preserveScroll: true,
        onSuccess: () => showMutationSuccess('CMS entry saved'),
        onError: () => showMutationError(null, 'Could not save CMS entry'),
        onFinish: () => setSaving(false),
      },
    );
  }

  return (
    <FormPageShell
      backTo="/admin/cms/index"
      backLabel="Back to CMS"
      title={label}
      description={catalog?.description ?? `Editing CMS entry: ${entryKey}`}
      icon={FileEdit}
      color="blue"
    >
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        {catalog?.previewPath ? (
          <Button asChild variant="outline" size="sm">
            <a href={catalog.previewPath} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 size-4" />
              Preview page
            </a>
          </Button>
        ) : null}
        {canManage ? (
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-2 size-4" />
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        ) : null}
      </div>

      <CmsEntryForm
        schema={schema}
        content={content}
        onChange={setContent}
        label={label}
        onLabelChange={setLabel}
        isPublished={isPublished}
        onPublishedChange={setIsPublished}
        readOnly={!canManage}
      />
    </FormPageShell>
  );
}
