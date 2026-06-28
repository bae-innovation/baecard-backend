export type LocalizedField = { en: string; bn: string };

export type CmsEntrySummary = {
  id: number;
  key: string;
  group: string;
  label: string;
  is_published: boolean;
  updated_at: string | null;
};

export type CmsEntryRecord = {
  key: string;
  label: string;
  content: Record<string, unknown>;
  is_published: boolean;
};

export type CmsSchema =
  | { type: 'hero' }
  | { type: 'repeater'; variant: string }
  | { type: 'page' }
  | { type: 'section_headings' }
  | { type: 'contact' }
  | { type: 'corporate' }
  | { type: 'seo' }
  | { type: 'json' };

export type CmsCatalogEntry = {
  key: string;
  label: string;
  description: string;
  group: CmsCatalogGroup;
  previewPath: string;
};

export type CmsCatalogGroup = 'homepage' | 'pages' | 'site';

export type CmsEditPageProps = {
  key: string;
  schema: CmsSchema;
  entry: CmsEntryRecord | null;
  defaults: Record<string, unknown>;
};
