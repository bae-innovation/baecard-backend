import { Plus, Trash2 } from 'lucide-react';
import * as React from 'react';

import { CmsImageField } from '@/features/cms/components/cms-image-field';
import { asLocalized, CmsLocalizedField } from '@/features/cms/components/cms-localized-field';
import type { CmsSchema, LocalizedField } from '@/features/cms/schemas/cms-entry.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

type CmsEntryFormProps = {
  schema: CmsSchema;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  label: string;
  onLabelChange: (label: string) => void;
  isPublished: boolean;
  onPublishedChange: (published: boolean) => void;
  readOnly?: boolean;
};

const SECTION_HEADING_KEYS = [
  'catalog',
  'howItWorks',
  'features',
  'reviews',
  'security',
  'faq',
  'corporate',
  'trust',
] as const;

const SEO_PAGE_KEYS = [
  'home',
  'products',
  'corporate',
  'security',
  'contact',
  'faq',
  'about',
] as const;

function RepeaterItemShell({
  index,
  onRemove,
  readOnly,
  children,
}: {
  index: number;
  onRemove: () => void;
  readOnly?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Item {index + 1}</span>
        {!readOnly ? (
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="size-4" />
          </Button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function RepeaterForm({
  schema,
  content,
  onChange,
  readOnly,
}: {
  schema: Extract<CmsSchema, { type: 'repeater' }>;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
  readOnly?: boolean;
}) {
  const items = (content.items as Record<string, unknown>[]) ?? [];

  function updateItem(index: number, patch: Record<string, unknown>) {
    const next = [...items];
    next[index] = { ...next[index], ...patch };
    onChange({ ...content, items: next });
  }

  function removeItem(index: number) {
    onChange({ ...content, items: items.filter((_, i) => i !== index) });
  }

  function addItem() {
    onChange({ ...content, items: [...items, {}] });
  }

  return (
    <>
      {items.map((item, index) => (
        <RepeaterItemShell
          key={index}
          index={index}
          readOnly={readOnly}
          onRemove={() => removeItem(index)}
        >
          {schema.variant === 'offers' ? (
            <>
              <Input
                placeholder="ID"
                disabled={readOnly}
                value={String(item.id ?? '')}
                onChange={(e) => updateItem(index, { id: e.target.value })}
              />
              <CmsLocalizedField
                label="Badge"
                disabled={readOnly}
                value={asLocalized(item.badge)}
                onChange={(v) => updateItem(index, { badge: v })}
              />
              <CmsLocalizedField
                label="Message"
                disabled={readOnly}
                value={asLocalized(item.message)}
                onChange={(v) => updateItem(index, { message: v })}
              />
              <Input
                placeholder="Link href"
                disabled={readOnly}
                value={String(item.href ?? '')}
                onChange={(e) => updateItem(index, { href: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={Boolean(item.enabled ?? true)}
                  disabled={readOnly}
                  onCheckedChange={(enabled) => updateItem(index, { enabled })}
                />
                <Label>Enabled</Label>
              </div>
            </>
          ) : null}

          {schema.variant === 'faq' ? (
            <>
              <CmsLocalizedField
                label="Question"
                disabled={readOnly}
                value={asLocalized(item.question)}
                onChange={(v) => updateItem(index, { question: v })}
              />
              <CmsLocalizedField
                label="Answer"
                disabled={readOnly}
                value={asLocalized(item.answer)}
                onChange={(v) => updateItem(index, { answer: v })}
              />
            </>
          ) : null}

          {schema.variant === 'order_steps' ? (
            <>
              <Input
                placeholder="ID"
                disabled={readOnly}
                value={String(item.id ?? '')}
                onChange={(e) => updateItem(index, { id: e.target.value })}
              />
              <CmsLocalizedField
                label="Title"
                disabled={readOnly}
                value={asLocalized(item.title)}
                onChange={(v) => updateItem(index, { title: v })}
              />
              <CmsLocalizedField
                label="Body"
                disabled={readOnly}
                value={asLocalized(item.body)}
                onChange={(v) => updateItem(index, { body: v })}
              />
            </>
          ) : null}

          {schema.variant === 'how_it_works' ? (
            <>
              <Input
                placeholder="ID"
                disabled={readOnly}
                value={String(item.id ?? '')}
                onChange={(e) => updateItem(index, { id: e.target.value })}
              />
              <CmsLocalizedField
                label="Label"
                disabled={readOnly}
                value={asLocalized(item.label)}
                onChange={(v) => updateItem(index, { label: v })}
              />
              <CmsLocalizedField
                label="Content"
                disabled={readOnly}
                value={asLocalized(item.content)}
                onChange={(v) => updateItem(index, { content: v })}
              />
            </>
          ) : null}

          {schema.variant === 'features' || schema.variant === 'security' ? (
            <>
              <CmsImageField
                label="Icon"
                disabled={readOnly}
                value={String(item.icon ?? '')}
                onChange={(icon) => updateItem(index, { icon })}
              />
              <CmsLocalizedField
                label="Title"
                disabled={readOnly}
                value={asLocalized(item.title)}
                onChange={(v) => updateItem(index, { title: v })}
              />
              <CmsLocalizedField
                label="Description"
                disabled={readOnly}
                value={asLocalized(item.description)}
                onChange={(v) => updateItem(index, { description: v })}
              />
            </>
          ) : null}

          {schema.variant === 'navigation' ? (
            <>
              <CmsLocalizedField
                label="Label"
                disabled={readOnly}
                value={asLocalized(item.label)}
                onChange={(v) => updateItem(index, { label: v })}
              />
              <Input
                placeholder="Href"
                disabled={readOnly}
                value={String(item.href ?? '')}
                onChange={(e) => updateItem(index, { href: e.target.value, route: e.target.value })}
              />
            </>
          ) : null}
        </RepeaterItemShell>
      ))}
      {!readOnly ? (
        <Button type="button" variant="outline" onClick={addItem}>
          <Plus className="mr-2 size-4" />
          Add row
        </Button>
      ) : null}
    </>
  );
}

export function CmsEntryForm({
  schema,
  content,
  onChange,
  label,
  onLabelChange,
  isPublished,
  onPublishedChange,
  readOnly,
}: CmsEntryFormProps) {
  if (schema.type === 'hero') {
    const hero = content as Record<string, LocalizedField>;
    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        {(['title', 'subtitle', 'ctaPrimary', 'ctaSecondary'] as const).map((field) => (
          <CmsLocalizedField
            key={field}
            label={field}
            disabled={readOnly}
            value={asLocalized(hero[field])}
            onChange={(v) => onChange({ ...content, [field]: v })}
          />
        ))}
      </FormShell>
    );
  }

  if (schema.type === 'repeater') {
    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        <RepeaterForm schema={schema} content={content} onChange={onChange} readOnly={readOnly} />
      </FormShell>
    );
  }

  if (schema.type === 'page') {
    const page = content as { title?: LocalizedField; subtitle?: LocalizedField; paragraphs?: LocalizedField[] };
    const paragraphs = page.paragraphs ?? [];

    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        <CmsLocalizedField
          label="Title"
          disabled={readOnly}
          value={asLocalized(page.title)}
          onChange={(v) => onChange({ ...content, title: v })}
        />
        <CmsLocalizedField
          label="Subtitle"
          disabled={readOnly}
          value={asLocalized(page.subtitle)}
          onChange={(v) => onChange({ ...content, subtitle: v })}
        />
        {paragraphs.map((p, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <CmsLocalizedField
                label={`Paragraph ${index + 1}`}
                disabled={readOnly}
                value={asLocalized(p)}
                onChange={(v) => {
                  const next = [...paragraphs];
                  next[index] = v;
                  onChange({ ...content, paragraphs: next });
                }}
              />
            </div>
            {!readOnly ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() =>
                  onChange({
                    ...content,
                    paragraphs: paragraphs.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        ))}
        {!readOnly ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange({ ...content, paragraphs: [...paragraphs, { en: '', bn: '' }] })}
          >
            <Plus className="mr-2 size-4" />
            Add paragraph
          </Button>
        ) : null}
      </FormShell>
    );
  }

  if (schema.type === 'section_headings') {
    const headings = content as Record<string, { title?: LocalizedField; subtitle?: LocalizedField }>;

    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        {SECTION_HEADING_KEYS.map((key) => (
          <div key={key} className="space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium capitalize">{key}</p>
            <CmsLocalizedField
              label="Title"
              disabled={readOnly}
              value={asLocalized(headings[key]?.title)}
              onChange={(title) =>
                onChange({
                  ...content,
                  [key]: { ...headings[key], title },
                })
              }
            />
            {key !== 'trust' ? (
              <CmsLocalizedField
                label="Subtitle"
                disabled={readOnly}
                value={asLocalized(headings[key]?.subtitle)}
                onChange={(subtitle) =>
                  onChange({
                    ...content,
                    [key]: { ...headings[key], subtitle },
                  })
                }
              />
            ) : null}
          </div>
        ))}
      </FormShell>
    );
  }

  if (schema.type === 'contact') {
    const contact = content as { heading?: LocalizedField; subheading?: LocalizedField };

    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        <CmsLocalizedField
          label="Heading"
          disabled={readOnly}
          value={asLocalized(contact.heading)}
          onChange={(heading) => onChange({ ...content, heading })}
        />
        <CmsLocalizedField
          label="Subheading"
          disabled={readOnly}
          value={asLocalized(contact.subheading)}
          onChange={(subheading) => onChange({ ...content, subheading })}
        />
      </FormShell>
    );
  }

  if (schema.type === 'corporate') {
    const corporate = content as {
      heading?: LocalizedField;
      subheading?: LocalizedField;
      bullets?: LocalizedField[];
    };
    const bullets = corporate.bullets ?? [];

    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        <CmsLocalizedField
          label="Heading"
          disabled={readOnly}
          value={asLocalized(corporate.heading)}
          onChange={(heading) => onChange({ ...content, heading })}
        />
        <CmsLocalizedField
          label="Subheading"
          disabled={readOnly}
          value={asLocalized(corporate.subheading)}
          onChange={(subheading) => onChange({ ...content, subheading })}
        />
        {bullets.map((bullet, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <CmsLocalizedField
                label={`Bullet ${index + 1}`}
                disabled={readOnly}
                value={asLocalized(bullet)}
                onChange={(v) => {
                  const next = [...bullets];
                  next[index] = v;
                  onChange({ ...content, bullets: next });
                }}
              />
            </div>
            {!readOnly ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-8"
                onClick={() =>
                  onChange({
                    ...content,
                    bullets: bullets.filter((_, i) => i !== index),
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </div>
        ))}
        {!readOnly ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => onChange({ ...content, bullets: [...bullets, { en: '', bn: '' }] })}
          >
            <Plus className="mr-2 size-4" />
            Add bullet
          </Button>
        ) : null}
      </FormShell>
    );
  }

  if (schema.type === 'seo') {
    const seo = content as Record<string, { title?: LocalizedField; description?: LocalizedField }>;

    return (
      <FormShell
        label={label}
        onLabelChange={onLabelChange}
        isPublished={isPublished}
        onPublishedChange={onPublishedChange}
        readOnly={readOnly}
      >
        {SEO_PAGE_KEYS.map((pageKey) => (
          <div key={pageKey} className="space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium capitalize">{pageKey} page</p>
            <CmsLocalizedField
              label="Meta title"
              disabled={readOnly}
              value={asLocalized(seo[pageKey]?.title)}
              onChange={(title) =>
                onChange({
                  ...content,
                  [pageKey]: { ...seo[pageKey], title },
                })
              }
            />
            <CmsLocalizedField
              label="Meta description"
              disabled={readOnly}
              value={asLocalized(seo[pageKey]?.description)}
              onChange={(description) =>
                onChange({
                  ...content,
                  [pageKey]: { ...seo[pageKey], description },
                })
              }
            />
          </div>
        ))}
      </FormShell>
    );
  }

  return (
    <FormShell
      label={label}
      onLabelChange={onLabelChange}
      isPublished={isPublished}
      onPublishedChange={onPublishedChange}
      readOnly={readOnly}
    >
      <Textarea
        className="min-h-[320px] font-mono text-sm"
        disabled={readOnly}
        value={JSON.stringify(content, null, 2)}
        onChange={(e) => {
          try {
            onChange(JSON.parse(e.target.value));
          } catch {
            // ignore invalid JSON while typing
          }
        }}
      />
    </FormShell>
  );
}

function FormShell({
  children,
  label,
  onLabelChange,
  isPublished,
  onPublishedChange,
  readOnly,
}: {
  children: React.ReactNode;
  label: string;
  onLabelChange: (label: string) => void;
  isPublished: boolean;
  onPublishedChange: (published: boolean) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="max-w-3xl space-y-6 rounded-2xl border bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Admin label</Label>
          <Input value={label} disabled={readOnly} onChange={(e) => onLabelChange(e.target.value)} />
        </div>
        <div className="flex items-end gap-3 pb-1">
          <Switch
            checked={isPublished}
            disabled={readOnly}
            onCheckedChange={onPublishedChange}
            id="published"
          />
          <Label htmlFor="published">Published on live site</Label>
        </div>
      </div>
      {children}
    </div>
  );
}
