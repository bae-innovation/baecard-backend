import { FaqAccordionBlock } from '@frontend/components/blocks/faq-accordion';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import type { MarketingContent } from '@frontend/types/marketing-content';

type FaqProps = {
  marketing?: MarketingContent | null;
};

export default function Faq({ marketing }: FaqProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="faq" contactVariant="faq">
      <FaqAccordionBlock showHeading={false} />
    </FrontendLayout>
  );
}
