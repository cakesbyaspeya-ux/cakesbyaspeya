'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  key: string;
  product_id: string;
  product_slug: string;
  product_name: string;
  image: string; // <-- Crucial for different designs
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
  mounted: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('cba_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cba_cart', JSON.stringify(items));
    } catch {}
  }, [items, mounted]);

  const add: CartContextValue['add'] = (item) => {
    // We include the image in the key so different designs are separate items
    const key = [
      item.product_id,
      item.variant ?? '',
      item.flavour ?? '',
      item.size_label ?? '',
      item.cake_message ?? '',
      item.image ?? '', // <-- Here is the fix
    ].join('|');

    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => i.key === key ? { ...i, qty: i.qty + item.qty } : i);
      }
      return [...prev, { ...item, key }];
    });
  };

  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));

  const setQty = (key: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear, subtotal, count, mounted }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}