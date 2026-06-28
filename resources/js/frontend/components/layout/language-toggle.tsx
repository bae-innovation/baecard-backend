import * as React from 'react';

import { useLocale } from '@frontend/providers/locale-provider';
import { cn } from '@/lib/utils';

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, toggleLocale } = useLocale();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={cn(
        'fe-touch inline-flex h-11 min-w-11 items-center justify-center rounded-full border border-fe-border bg-fe-surface/80 px-2.5 text-xs font-semibold uppercase tracking-wide text-fe-text transition-colors hover:text-fe-accent sm:h-9 sm:min-w-9',
        className,
      )}
      aria-label={locale === 'en' ? 'Switch to Bengali' : 'Switch to English'}
    >
      {locale === 'en' ? 'BN' : 'EN'}
    </button>
  );
}
