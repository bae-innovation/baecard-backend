import {
  captureInstallPrompt,
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
} from '@/pwa/capture-install-prompt';

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  captureInstallPrompt();

  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
    // Install prompt may still work in some browsers; ignore registration errors.
  });
}
