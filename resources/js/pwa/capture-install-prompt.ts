const PWA_INSTALLED_KEY = 'bae-pwa-installed';

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

let deferredInstallPrompt: BeforeInstallPromptEvent | null = null;

export function captureInstallPrompt(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event as BeforeInstallPromptEvent;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    try {
      localStorage.setItem(PWA_INSTALLED_KEY, '1');
    } catch {
      // Ignore storage errors in private mode.
    }
  });
}

export function hasInstalledPwaFlag(): boolean {
  try {
    return localStorage.getItem(PWA_INSTALLED_KEY) === '1';
  } catch {
    return false;
  }
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredInstallPrompt;
}

export function clearDeferredInstallPrompt(): void {
  deferredInstallPrompt = null;
}
