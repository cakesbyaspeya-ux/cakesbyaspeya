'use client';

import { createContext, useContext, useEffect, useState } from 'react';

export type CartItem = {
  key: string;                  
  product_id: string;
  product_slug: string;
  product_name: string;
  image: string;
  design_id?: string | null;    
  design_label?: string | null; 
  variant?: string | null;
  flavour?: string | null;
  size_label?: string | null;
  cake_message?: string | null;
  unit_price: number;
  qty: number;
};

export type UpsellItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  upsells: UpsellItem[];
  add: (item: Omit<CartItem, 'key'>) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  addUpsell: (upsell: any) => void;
  removeUpsell: (id: string) => void;
  setUpsellQty: (id: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  count: number;
  mounted: boolean;            
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [upsells, setUpsells] = useState<UpsellItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const rawCart = localStorage.getItem('cba_cart');
      if (rawCart) {
        const parsed = JSON.parse(rawCart);
        if (Array.isArray(parsed)) setItems(parsed);
      }
      const rawUpsells = localStorage.getItem('cba_upsells');
      if (rawUpsells) {
        const parsed = JSON.parse(rawUpsells);
        if (Array.isArray(parsed)) setUpsells(parsed);
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('cba_cart', JSON.stringify(items));
      localStorage.setItem('cba_upsells', JSON.stringify(upsells));
    } catch {}
  }, [items, upsells, mounted]);

  const add: CartContextValue['add'] = (item) => {
    const key = [
      item.product_id,
      item.variant ?? '',
      item.flavour ?? '',
      item.size_label ?? '',
      item.cake_message ?? '',
      item.design_id ?? '',
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
    setItems((prev) => qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty } : i)));

  const addUpsell = (u: any) => {
    setUpsells(prev => {
      const existing = prev.find(i => i.id === u.id);
      if (existing) return prev.map(i => i.id === u.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: u.id, name: u.name, price: Number(u.price), qty: 1 }];
    });
  };

  const removeUpsell = (id: string) => setUpsells(prev => prev.filter(i => i.id !== id));
  
  const setUpsellQty = (id: string, qty: number) =>
    setUpsells(prev => qty <= 0 ? prev.filter(i => i.id !== id) : prev.map(i => (i.id === id ? { ...i, qty } : i)));

  const clear = () => { setItems([]); setUpsells([]); };

  const upsellTotal = upsells.reduce((s, i) => s + i.price * i.qty, 0);
  const subtotal = items.reduce((s, i) => s + i.unit_price * i.qty, 0) + upsellTotal;
  const count = items.reduce((s, i) => s + i.qty, 0) + upsells.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ 
      items, upsells, add, remove, setQty, addUpsell, removeUpsell, setUpsellQty, 
      clear, subtotal, count, mounted 
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}