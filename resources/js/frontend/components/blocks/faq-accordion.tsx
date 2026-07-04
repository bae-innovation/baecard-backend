import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { PremiumSectionHeading } from '@frontend/components/ui/premium-section-heading';
import { useReducedMotion } from '@frontend/hooks/use-reduced-motion';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import { cn } from '@/lib/utils';

import { SectionShell } from './section-shell';

export function FaqAccordionBlock({ showHeading = true }: { showHeading?: boolean }) {
  const { content, translate } = useMarketingContent();
  const reducedMotion = useReducedMotion();

  return (
    <SectionShell id="faq" className="fe-faq-section relative overflow-hidden">
      <motion.div
        className="pointer-events-none absolute -left-16 top-20 size-60 rounded-full bg-fe-accent/12 blur-3xl fe-orb-drift"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      />
      <motion.div
        className="pointer-events-none absolute -right-20 bottom-16 size-72 rounded-full bg-fe-accent/10 blur-3xl fe-orb-drift-reverse"
        aria-hidden
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      />

      {showHeading ? (
        <PremiumSectionHeading
          badge={translate(content.sectionHeadings.faq.title)}
          title={translate(content.sectionHeadings.faq.title)}
          subtitle={translate(content.sectionHeadings.faq.subtitle)}
          icon={HelpCircle}
        />
      ) : null}

      <Accordion type="single" collapsible className="mx-auto max-w-3xl space-y-3">
        {content.faq.map((item, index) => (
          <motion.div
            key={index}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-24px' }}
            transition={{ delay: index * 0.06, duration: 0.45, type: 'spring', stiffness: 280 }}
          >
            <AccordionItem
              value={`faq-${index}`}
              className={cn(
                'overflow-hidden rounded-2xl border border-fe-border bg-fe-surface/90 px-1 shadow-[0_8px_32px_color-mix(in_srgb,var(--fe-accent)_8%,transparent)]',
                'transition-[border-color,box-shadow] duration-300',
                'data-[state=open]:border-fe-accent/40 data-[state=open]:shadow-[0_12px_40px_color-mix(in_srgb,var(--fe-accent)_16%,transparent)]',
              )}
            >
              <AccordionTrigger className="px-5 py-4 text-left font-semibold text-fe-text hover:text-fe-accent hover:no-underline sm:px-6 sm:py-5">
                <span className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-fe-accent/15 text-xs font-bold text-fe-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {translate(item.question)}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-fe-muted sm:px-6 sm:pb-6 sm:text-base">
                {translate(item.answer)}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </SectionShell>
  );
}
