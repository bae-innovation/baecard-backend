import { Download } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
} from '@/pwa/capture-install-prompt';
import { InstallHelpSheet } from '@/pwa/install-help-sheet';
import { IosInstallSheet } from '@/pwa/ios-install-sheet';
import { isStandaloneDisplayMode } from '@/pwa/is-standalone';

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  const ua = navigator.userAgent;
  const isIos = /iPad|iPhone|iPod/.test(ua);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|Chrome/.test(ua);

  return isIos && isSafari;
}

type InstallAppButtonProps = {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'icon';
  className?: string;
  label?: string;
};

export function InstallAppButton({
  variant = 'outline',
  size = 'sm',
  className,
  label = 'Download your app',
}: InstallAppButtonProps) {
  const [installed, setInstalled] = React.useState(isStandaloneDisplayMode());
  const [iosSheetOpen, setIosSheetOpen] = React.useState(false);
  const [helpSheetOpen, setHelpSheetOpen] = React.useState(false);
  const [promptReady, setPromptReady] = React.useState(Boolean(getDeferredInstallPrompt()));

  React.useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setPromptReady(true);
    };

    const onInstalled = () => {
      setInstalled(true);
      clearDeferredInstallPrompt();
      setPromptReady(false);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    if (getDeferredInstallPrompt()) {
      setPromptReady(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  if (installed) {
    return null;
  }

  const handleClick = async () => {
    const deferredPrompt = getDeferredInstallPrompt();

    if (deferredPrompt) {
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      clearDeferredInstallPrompt();
      setPromptReady(false);
      return;
    }

    if (isIosSafari()) {
      setIosSheetOpen(true);
      return;
    }

    setHelpSheetOpen(true);
  };

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={className}
        onClick={() => void handleClick()}
        title={
          promptReady
            ? 'Install BAE Card on your device'
            : 'Install BAE Card (use browser menu if prompt is unavailable)'
        }
      >
        {size === 'icon' ? (
          <Download className="size-4" />
        ) : (
          <>
            <Download className="mr-2 size-4" />
            {label}
          </>
        )}
      </Button>
      <IosInstallSheet open={iosSheetOpen} onOpenChange={setIosSheetOpen} />
      <InstallHelpSheet open={helpSheetOpen} onOpenChange={setHelpSheetOpen} />
    </>
  );
}
