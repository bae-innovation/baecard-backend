import { hasInstalledPwaFlag } from '@/pwa/capture-install-prompt';

/**
 * Detects whether the app is running as an installed PWA (not a normal browser tab).
 */
export function isStandaloneDisplayMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  if (document.documentElement.classList.contains('pwa-standalone')) {
    return true;
  }

  const displayModes = ['standalone', 'fullscreen', 'minimal-ui', 'window-controls-overlay'];

  for (const mode of displayModes) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return true;
    }
  }

  const navigatorWithStandalone = window.navigator as Navigator & { standalone?: boolean };

  if (navigatorWithStandalone.standalone === true) {
    return true;
  }

  // Fallback when the installed app window does not report standalone on some desktops.
  if (hasInstalledPwaFlag() && !window.matchMedia('(display-mode: browser)').matches) {
    return true;
  }

  return false;
}

export function markStandaloneDocument(): void {
  if (typeof document === 'undefined' || !isStandaloneDisplayMode()) {
    return;
  }

  document.documentElement.classList.add('pwa-standalone');
}
