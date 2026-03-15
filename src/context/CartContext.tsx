import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CartItem = { productId: string; quantity: number };

type CartContextValue = {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === productId);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], quantity: next[i].quantity + quantity };
        return next;
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      const i = prev.findIndex((x) => x.productId === productId);
      if (i < 0) return prev;
      const next = [...prev];
      next[i] = { ...next[i], quantity };
      return next;
    });
  };

  const clearCart = () => setItems([]);

  const itemCount = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);

  const value: CartContextValue = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart, itemCount }),
    [items, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
