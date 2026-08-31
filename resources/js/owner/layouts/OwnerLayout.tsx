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
        className="flex h-full max-h-full min-h-0 w-full flex-col overflow-hidden bg-background"
      >
        <OwnerTopBar />
        <main
          className={cn(
            'min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain',
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
