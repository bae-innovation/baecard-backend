import { StructuredPageBody } from '@frontend/components/blocks/structured-page';
import { CorporateForm } from '@frontend/components/corporate/corporate-form';
import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import { useMarketingContent } from '@frontend/providers/marketing-content-provider';
import type { MarketingContent } from '@frontend/types/marketing-content';

type CorporateProps = {
  marketing?: MarketingContent | null;
};

function CorporateContent() {
  const { content, translate } = useMarketingContent();

  return (
    <>
      <StructuredPageBody page={content.pages.corporate} translate={translate} />
      <CorporateForm />
    </>
  );
}

export default function Corporate({ marketing }: CorporateProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="corporate" contactVariant="corporate">
      <CorporateContent />
    </FrontendLayout>
  );
}
