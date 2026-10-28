"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = { productId: string; quantity: number };
type CartContextValue = {
  items: CartItem[];
  add: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "cipherguard-demo-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    add: (productId) => setItems((old) => {
      const existing = old.find((item) => item.productId === productId);
      return existing
        ? old.map((item) => item.productId === productId ? { ...item, quantity: Math.min(9, item.quantity + 1) } : item)
        : [...old, { productId, quantity: 1 }];
    }),
    remove: (productId) => setItems((old) => old.filter((item) => item.productId !== productId)),
    clear: () => setItems([]),
    count: items.reduce((sum, item) => sum + item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
