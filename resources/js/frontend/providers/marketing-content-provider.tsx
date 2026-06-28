import * as React from 'react';

import { DEFAULT_MARKETING_CONTENT } from '@frontend/config/marketing-content.defaults';
import { deepMergeMarketingContent } from '@frontend/lib/deep-merge-content';
import { t } from '@frontend/lib/localized';
import { useLocale } from '@frontend/providers/locale-provider';
import type { LocalizedString, MarketingContent } from '@frontend/types/marketing-content';

type MarketingContentContextValue = {
  content: MarketingContent;
  translate: (value: LocalizedString) => string;
};

const MarketingContentContext = React.createContext<MarketingContentContextValue | null>(null);

export function MarketingContentProvider({
  children,
  content,
}: {
  children: React.ReactNode;
  content?: MarketingContent | null;
}) {
  const { locale } = useLocale();
  const resolved = React.useMemo(
    () => deepMergeMarketingContent(DEFAULT_MARKETING_CONTENT, content ?? undefined),
    [content],
  );

  const translate = React.useCallback(
    (value: LocalizedString) => t(value, locale),
    [locale],
  );

  const value = React.useMemo(
    () => ({ content: resolved, translate }),
    [resolved, translate],
  );

  return (
    <MarketingContentContext.Provider value={value}>{children}</MarketingContentContext.Provider>
  );
}

export function useMarketingContent() {
  const ctx = React.useContext(MarketingContentContext);
  if (!ctx) throw new Error('useMarketingContent must be used within MarketingContentProvider');
  return ctx;
}
