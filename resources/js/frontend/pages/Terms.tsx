import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type TermsProps = {
  marketing?: MarketingContent | null;
};

function TermsContent() {
  const { content, translate } = useMarketingContent();
  return <StructuredPageBody page={content.pages.terms} translate={translate} />;
}

export default function Terms({ marketing }: TermsProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="terms" contactVariant="terms" showContactBlock>
      <TermsContent />
    </FrontendLayout>
  );
}
