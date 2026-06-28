import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { faqItems } from '@frontend/constants/faq-content';
import { MotionSection } from '@frontend/components/ui/motion-section';
import { SectionHeading } from '@frontend/components/ui/section-heading';

export function FaqSection() {
  const half = Math.ceil(faqItems.length / 2);
  const left = faqItems.slice(0, half);
  const right = faqItems.slice(half);

  return (
    <MotionSection id="faq" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <SectionHeading title="Frequently Asked Questions" />
        <div className="grid gap-8 md:grid-cols-2">
          {[left, right].map((column, colIndex) => (
            <Accordion key={colIndex} type="single" collapsible className="space-y-2">
              {column.map((item, i) => (
                <AccordionItem key={item.question} value={`faq-${colIndex}-${i}`} className="border-white/10">
                  <AccordionTrigger className="text-left text-white hover:text-[#66FCF1]">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-white/60">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ))}
        </div>
      </div>
    </MotionSection>
  );
}
