import type { MarketingProduct } from '@frontend/types/marketing';
import * as React from 'react';

export type CartLine = {
  product: MarketingProduct;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  addItem: (product: MarketingProduct, quantity?: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  total: number;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartLine[]>([]);

  const addItem = React.useCallback((product: MarketingProduct, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((line) => line.product.id === product.id);
      if (existing) {
        return prev.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeItem = React.useCallback((productId: number) => {
    setItems((prev) => prev.filter((line) => line.product.id !== productId));
  }, []);

  const clear = React.useCallback(() => setItems([]), []);

  const total = React.useMemo(
    () =>
      items.reduce((sum, line) => {
        const price = Number(line.product.price ?? 0);
        return sum + price * line.quantity;
      }, 0),
    [items],
  );

  const value = React.useMemo(
    () => ({ items, addItem, removeItem, clear, total }),
    [items, addItem, removeItem, clear, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
