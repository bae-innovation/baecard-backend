import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type PolicyProps = {
  marketing?: MarketingContent | null;
};

function PolicyContent() {
  const { content, translate } = useMarketingContent();
  return <StructuredPageBody page={content.pages.policy} translate={translate} />;
}

export default function Policy({ marketing }: PolicyProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="policy" contactVariant="policy" showContactBlock>
      <PolicyContent />
    </FrontendLayout>
  );
}
