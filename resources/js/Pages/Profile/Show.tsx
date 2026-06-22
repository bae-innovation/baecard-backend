import { Mail, Phone, QrCode, UserRound } from 'lucide-react';

import { AppBrandLogo } from '@/components/shared/app-brand-logo';
import { AppHead } from '@/components/shared/app-head';
import { AppSettingsSync } from '@/components/shared/app-settings-sync';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type {
  PublicProfileCard,
  PublicProfileUser,
} from '@/features/cards/schemas/card-code.schema';
import { useAppSettings } from '@/hooks/useAppSettings';

type ProfileShowProps = {
  card: PublicProfileCard;
  user: PublicProfileUser;
};

export default function ProfileShow({ card, user }: ProfileShowProps) {
  const app = useAppSettings();

  return (
    <>
      <AppHead title={user.name} />
      <AppSettingsSync />
      <div className="min-h-svh bg-gradient-to-br from-slate-950 via-indigo-950 to-teal-900 px-4 py-10 text-white">
        <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center overflow-hidden rounded-2xl bg-white/10 backdrop-blur">
              <AppBrandLogo
                variant="auth"
                imageClassName="max-h-10 max-w-10"
                fallbackClassName="text-xl text-white"
              />
            </div>
            <div>
              <p className="text-sm text-white/70">{app.name}</p>
              <p className="font-medium">Digital Business Card</p>
            </div>
          </div>

          <Card className="w-full overflow-hidden border-white/10 bg-white/95 text-foreground shadow-2xl backdrop-blur">
            <CardHeader className="items-center space-y-4 pb-2 text-center">
              <div className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-teal-500 text-3xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {card.code}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <UserRound className="size-4" />
                  Contact
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 size-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 size-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium">{user.phone ?? card.phone ?? '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <QrCode className="size-4" />
                  Card link
                </p>
                <a
                  href={card.scan_url}
                  className="break-all text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {card.scan_url}
                </a>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-white/60">
            Copyright © {new Date().getFullYear()} {app.name}
          </p>
        </div>
      </div>
    </>
  );
}
