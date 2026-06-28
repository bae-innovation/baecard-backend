import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { StaggerContainer, StaggerItem } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';

import { SectionShell } from './section-shell';

export function FaqAccordionBlock() {
  const { content, translate } = useMarketingContent();

  return (
    <SectionShell id="faq">
      <SectionHeading
        title={translate(content.sectionHeadings.faq.title)}
        subtitle={translate(content.sectionHeadings.faq.subtitle)}
      />
      <Accordion type="single" collapsible className="mx-auto max-w-3xl">
        {content.faq.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-fe-border">
            <AccordionTrigger className="text-left text-fe-text hover:text-fe-accent">
              {translate(item.question)}
            </AccordionTrigger>
            <AccordionContent className="text-fe-muted">{translate(item.answer)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}
