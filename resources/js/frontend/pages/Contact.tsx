import { FrontendLayout } from '@frontend/layouts/FrontendLayout';
import type { MarketingContent } from '@frontend/types/marketing-content';

type ContactProps = {
  marketing?: MarketingContent | null;
};

export default function Contact({ marketing }: ContactProps) {
  return (
    <FrontendLayout marketing={marketing} pageSlug="contact" contactVariant="contact" showContactBlock>
      <div aria-hidden className="h-0" />
    </FrontendLayout>
  );
}
