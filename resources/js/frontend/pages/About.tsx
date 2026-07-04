import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type AboutProps = {
  marketing?: MarketingContent | null;
};

function AboutContent() {
  const { content, translate } = useMarketingContent();
  return (
    <StructuredPageBody page={content.pages.about} translate={translate} variant="about" />
  );
}

export default function About({ marketing }: AboutProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="about" contactVariant="about">
      <AboutContent />
    </FrontendLayout>
  );
}
