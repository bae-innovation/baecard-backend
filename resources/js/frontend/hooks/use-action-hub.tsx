import * as React from 'react';

import type { ActionHubTab, MarketingProduct } from '@frontend/types/marketing';

type ActionHubContextValue = {
  open: boolean;
  tab: ActionHubTab;
  selectedProduct: MarketingProduct | null;
  vendorSlug: string | null;
  openHub: (tab: ActionHubTab, product?: MarketingProduct | null) => void;
  setTab: (tab: ActionHubTab) => void;
  closeHub: () => void;
  setVendorSlug: (slug: string | null) => void;
};

const ActionHubContext = React.createContext<ActionHubContextValue | null>(null);

export function ActionHubProvider({
  children,
  vendorSlug: initialVendorSlug = null,
}: {
  children: React.ReactNode;
  vendorSlug?: string | null;
}) {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<ActionHubTab>('message');
  const [selectedProduct, setSelectedProduct] = React.useState<MarketingProduct | null>(null);
  const [vendorSlug, setVendorSlug] = React.useState<string | null>(initialVendorSlug);

  const openHub = React.useCallback((nextTab: ActionHubTab, product?: MarketingProduct | null) => {
    setTab(nextTab);
    setSelectedProduct(product ?? null);
    setOpen(true);
  }, []);

  const closeHub = React.useCallback(() => setOpen(false), []);

  const setTabOnly = React.useCallback((nextTab: ActionHubTab) => setTab(nextTab), []);

  const value = React.useMemo(
    () => ({
      open,
      tab,
      selectedProduct,
      vendorSlug,
      openHub,
      setTab: setTabOnly,
      closeHub,
      setVendorSlug,
    }),
    [open, tab, selectedProduct, vendorSlug, openHub, setTabOnly, closeHub],
  );

  return <ActionHubContext.Provider value={value}>{children}</ActionHubContext.Provider>;
}

export function useActionHub() {
  const ctx = React.useContext(ActionHubContext);
  if (!ctx) throw new Error('useActionHub must be used within ActionHubProvider');
  return ctx;
}
