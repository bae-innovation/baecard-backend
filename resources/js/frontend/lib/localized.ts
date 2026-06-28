import type { Locale, LocalizedString } from '@frontend/types/marketing-content';

export function t(value: LocalizedString, locale: Locale): string {
  if (locale === 'bn' && value.bn.trim()) return value.bn;
  return value.en;
}

export function ls(en: string, bn: string): LocalizedString {
  return { en, bn };
}
