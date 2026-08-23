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
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight">My card</h1>
          <p className="text-sm text-muted-foreground">
            This is what people see when they tap your NFC card or open your link.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => copy(publicUrl)}>
            <Copy className="mr-2 size-4" />
            {isCopied ? 'Copied' : 'Copy link'}
          </Button>
          <Button type="button" variant="outline" size="sm" asChild>
            <a href={publicUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 size-4" />
              Open live card
            </a>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'w-full overflow-hidden',
          theme.mode === 'dark' ? 'bg-[#0a0a0a]' : 'bg-stone-200',
        )}
      >
        <ActiveTemplate
          card={card}
          user={user}
          social_links={social_links}
          isPreview
        />
      </div>

      <div className="mx-4 mb-4 mt-4 rounded-xl border bg-card p-4 shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Share with QR
        </p>
        <div className="mt-3 flex flex-col items-center gap-3">
          <div className="rounded-xl bg-white p-4">
            <QRCode value={card.scan_url} size={160} />
          </div>
          <p className="font-mono text-sm font-semibold">{card.code}</p>
        </div>
      </div>
    </div>
  );
}
