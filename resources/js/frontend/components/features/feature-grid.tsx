import { motion } from 'framer-motion';

import { MarketingCard } from '@frontend/components/ui/marketing-card';
import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

import { SectionShell } from '@frontend/components/blocks/section-shell';

export function FeatureGrid() {
  const { content, translate } = useMarketingContent();

  return (
    <SectionShell id="workColumn">
      <SectionHeading
        title={translate(content.sectionHeadings.features.title)}
        subtitle={translate(content.sectionHeadings.features.subtitle)}
      />
      <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {content.features.map((item) => (
          <StaggerItem key={translate(item.title)}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
              <MarketingCard className="group relative h-full overflow-hidden text-center">
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-2 ring-fe-accent transition-opacity group-hover:opacity-100" />
                <img src={item.icon} alt="" className="mx-auto mb-4 h-16 w-16" />
                <h3 className="mb-3 text-lg font-semibold text-fe-text">{translate(item.title)}</h3>
                <p className="text-sm text-fe-muted">{translate(item.description)}</p>
              </MarketingCard>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
