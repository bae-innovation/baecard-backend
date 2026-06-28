import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

import { SectionShell } from './section-shell';

export function SecurityCardsBlock() {
  const { content, translate } = useMarketingContent();

  return (
    <SectionShell id="security">
      <SectionHeading
        title={translate(content.sectionHeadings.security.title)}
        subtitle={translate(content.sectionHeadings.security.subtitle)}
      />
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.security.map((item) => (
          <StaggerItem key={translate(item.title)}>
            <div className="flex h-full flex-col rounded-2xl border border-fe-border bg-fe-surface/80 p-6 backdrop-blur-sm transition-colors hover:border-fe-accent/40">
              <img src={item.icon} alt="" className="mb-4 size-12" aria-hidden />
              <h3 className="mb-2 font-semibold text-fe-text">{translate(item.title)}</h3>
              <p className="text-sm leading-relaxed text-fe-muted">{translate(item.description)}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
