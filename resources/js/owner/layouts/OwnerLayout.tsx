import type { ReactNode } from 'react';

import { AppHead } from '@/components/shared/app-head';
import { AppSettingsSync } from '@/components/shared/app-settings-sync';
import { FlashToaster } from '@/components/shared/flash-toaster';
import { OwnerBottomNav } from '@/owner/components/owner-bottom-nav';
import { OwnerTopBar } from '@/owner/components/owner-top-bar';
import { cn } from '@/lib/utils';

type OwnerLayoutProps = {
  children: ReactNode;
  className?: string;
};

export default function OwnerLayout({ children, className }: OwnerLayoutProps) {
  return (
    <>
      <AppHead />
      <AppSettingsSync />
      <FlashToaster />
      <div
        data-owner-app
        className="flex h-dvh w-full max-h-dvh min-h-0 flex-col overflow-hidden bg-background"
      >
        <OwnerTopBar />
        <main
          className={cn(
            'flex min-h-0 w-full flex-1 flex-col overflow-y-auto overscroll-contain touch-pan-y',
            className,
          )}
        >
          {children}
        </main>
        <OwnerBottomNav />
      </div>
    </>
  );
}
