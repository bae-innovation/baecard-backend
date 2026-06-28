import { Link } from '@inertiajs/react';
import { FileEdit, Globe } from 'lucide-react';

import {
  CMS_CATALOG_GROUPS,
  getCatalogByGroup,
} from '@/features/cms/config/cms-entry-catalog';
import type { CmsCatalogGroup, CmsEntrySummary } from '@/features/cms/schemas/cms-entry.schema';
import { PageTitle } from '@/components/shared/page-title';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type CmsIndexPageProps = {
  entries: CmsEntrySummary[];
};

function entryStatus(entry: CmsEntrySummary | undefined, hasEntry: boolean) {
  if (entry?.is_published) return { label: 'Published', variant: 'default' as const };
  if (hasEntry) return { label: 'Draft', variant: 'secondary' as const };
  return { label: 'Using defaults', variant: 'outline' as const };
}

function CmsGroupSection({
  group,
  entries,
}: {
  group: CmsCatalogGroup;
  entries: CmsEntrySummary[];
}) {
  const meta = CMS_CATALOG_GROUPS[group];
  const catalog = getCatalogByGroup(group);
  const entryMap = new Map(entries.map((entry) => [entry.key, entry]));

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{meta.title}</h2>
        <p className="text-sm text-muted-foreground">{meta.description}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {catalog.map((item) => {
          const existing = entryMap.get(item.key);
          const status = entryStatus(existing, entryMap.has(item.key));

          return (
            <Card key={item.key}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base">{item.label}</CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-2">
                <span className="text-xs text-muted-foreground">
                  {existing?.updated_at
                    ? `Updated ${new Date(existing.updated_at).toLocaleDateString()}`
                    : item.key}
                </span>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/admin/cms/${item.key}`}>
                    <FileEdit className="mr-2 size-4" />
                    Edit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

export function CmsIndexPage({ entries }: CmsIndexPageProps) {
  return (
    <div className="space-y-8 py-4">
      <PageTitle
        title="Website CMS"
        description="Manage public marketing site content. Published changes appear on the live site within a few minutes."
        icon={Globe}
        color="blue"
      />

      <CmsGroupSection group="homepage" entries={entries} />
      <CmsGroupSection group="pages" entries={entries} />
      <CmsGroupSection group="site" entries={entries} />
    </div>
  );
}
