import { Copy, ExternalLink } from 'lucide-react';
import QRCode from 'react-qr-code';

import { Button } from '@/components/ui/button';
import type { ProfileSocialLink } from '@/features/profile/schemas/profile-social.schema';
import { PROFILE_TEMPLATES } from '@/features/profile/templates';
import { getProfileTheme } from '@/features/profile/templates/theme-tokens';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';
import { useCopyToClipboardWithStatus } from '@/hooks/useCopyToClipboardWithStatus';
import { cn } from '@/lib/utils';

export type OwnerHomePageProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
  social_links: ProfileSocialLink[];
};

export function OwnerHomePage({ card, user, social_links }: OwnerHomePageProps) {
  const templateId = user.active_template ?? 1;
  const ActiveTemplate =
    PROFILE_TEMPLATES[templateId as keyof typeof PROFILE_TEMPLATES] ?? PROFILE_TEMPLATES[1];
  const theme = getProfileTheme(templateId);
  const publicUrl = card.profile_url ?? card.scan_url;
  const { copy, isCopied } = useCopyToClipboardWithStatus();

  return (
    <div className="flex flex-col">
      <div className="owner-page-header owner-stack pt-5">
        <div className="owner-stack">
          <h1 className="owner-h1">My card</h1>
          <p className="owner-lead">
            This is what people see when they tap your NFC card or open your link.
          </p>
        </div>

        <div className="owner-actions-col sm:flex-row sm:flex-wrap">
          <Button type="button" variant="outline" className="w-full sm:w-auto" onClick={() => copy(publicUrl)}>
            <Copy className="owner-icon-inline" />
            {isCopied ? 'Copied' : 'Copy link'}
          </Button>
          <Button type="button" variant="outline" className="w-full sm:w-auto" asChild>
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="owner-icon-inline" />
              Open live card
            </a>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'owner-card-preview w-full overflow-hidden',
          theme.mode === 'dark' ? 'bg-[#0a0a0a]' : 'bg-stone-200',
        )}
      >
        <ActiveTemplate
          card={card}
          user={user}
          social_links={social_links}
          isPreview
          density="comfortable"
        />
      </div>

      <div className="owner-card mx-4 mb-5 mt-4">
        <p className="owner-label">Share with QR</p>
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="owner-qr-wrap rounded-xl bg-white">
            <div className="owner-qr-code">
              <QRCode value={card.scan_url} size={200} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
          <p className="owner-mono-code">{card.code}</p>
        </div>
      </div>
    </div>
  );
}
