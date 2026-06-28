import { SectionHeading } from '@frontend/components/ui/section-heading';
import type { PageContent } from '@frontend/types/marketing-content';

import { SectionShell } from './section-shell';

type StructuredPageProps = {
  page: PageContent;
  translate: (value: { en: string; bn: string }) => string;
  showHeading?: boolean;
};

export function StructuredPageBody({ page, translate, showHeading = false }: StructuredPageProps) {
  return (
    <SectionShell>
      <div className="mx-auto max-w-3xl">
        {showHeading ? (
          <SectionHeading
            title={translate(page.title)}
            subtitle={page.subtitle ? translate(page.subtitle) : undefined}
          />
        ) : null}
        <div className="space-y-6 text-lg leading-relaxed text-fe-muted">
          {page.paragraphs.map((p) => (
            <p key={translate(p).slice(0, 32)}>{translate(p)}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
