import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { SecurityCardsBlock } from '@frontend/components/blocks/security-cards';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type SecurityProps = {
  marketing?: MarketingContent | null;
};

function SecurityContent() {
  const { content, translate } = useMarketingContent();

  return (
    <>
      <StructuredPageBody page={content.pages.security} translate={translate} />
      <SecurityCardsBlock showHeading={false} />
    </>
  );
}

export default function Security({ marketing }: SecurityProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="security" contactVariant="security">
      <SecurityContent />
    </FrontendLayout>
  );
}
