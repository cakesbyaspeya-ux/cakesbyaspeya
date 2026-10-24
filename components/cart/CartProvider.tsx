'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// ── Types ────────────────────────────────────────────────
export type CartItem = {
  key: string;                  // unique per (product + variant + flavour + size + message)
  product_id: string;
  product_slug: string;
  product_name: string;
  image: string;
  variant?: string | null;
  flavour?: string | null;
  size_label?: string | null;
  cake_message?: string | null;
  unit_price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, 'key'>) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  mounted: boolean;            // true after client mount — used to avoid hydration mismatch
};

// ── Context ──────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage once on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cba_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore corrupt storage
    }
    setMounted(true);
  }, []);

  // Persist to localStorage on every change (after mount, to avoid SSR write)
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cba_cart', JSON.stringify(items));
    } catch {
      // quota exceeded — ignore
    }
  }, [items, mounted]);

  const add: CartContextValue['add'] = (item) => {
    const key = [
      item.product_id,
      item.variant ?? '',
      item.flavour ?? '',
      item.size_label ?? '',
      item.cake_message ?? '',
    ].join('|');

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + item.qty } : i
        );
      }
      return [...prev, { ...item, key }];
    });
  };

  const remove = (key: string) =>
    setItems((prev) => prev.filter((i) => i.key !== key));

  const setQty = (key: string, qty: number) =>
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider
      value={{ items, add, remove, setQty, clear, subtotal, count, mounted }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside <CartProvider>');
  }
  return ctx;
}