import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { OrderStep } from '@frontend/types/marketing-content';

import { SectionShell } from './section-shell';

type StepTimelineProps = {
  steps?: OrderStep[];
  title?: string;
  subtitle?: string;
};

export function StepTimeline({ steps, title, subtitle }: StepTimelineProps) {
  const { content, translate } = useMarketingContent();
  const items = steps ?? content.orderSteps;
  const headingTitle = title ?? translate(content.sectionHeadings.howItWorks.title);
  const headingSubtitle = subtitle ?? translate(content.sectionHeadings.howItWorks.subtitle);

  return (
    <SectionShell id="order-setup">
      <SectionHeading title={headingTitle} subtitle={headingSubtitle} />
      <StaggerContainer className="grid gap-6 md:grid-cols-3">
        {items.map((step, index) => (
          <StaggerItem key={step.id}>
            <div className="relative rounded-2xl border border-fe-border bg-fe-surface/80 p-6 backdrop-blur-sm">
              <span className="mb-4 inline-flex size-10 items-center justify-center rounded-full bg-fe-accent/15 text-lg font-bold text-fe-accent">
                {index + 1}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-fe-text">{translate(step.title)}</h3>
              <p className="text-sm leading-relaxed text-fe-muted">{translate(step.body)}</p>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
