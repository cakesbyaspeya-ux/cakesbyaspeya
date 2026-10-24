'use client';

import { useCart } from '@/components/cart/CartProvider';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function OrderSummary() {
  const { subtotal, items } = useCart();

  return (
    <div className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 shadow-soft">
      <h3 className="font-display text-xl text-ink border-b border-olive/20 pb-3 mb-4">Order Summary</h3>
      
      <div className="space-y-2 text-sm text-olive-dark mb-4">
        {items.map((it) => (
          <div key={it.key} className="flex justify-between gap-3">
            <span className="truncate">{it.qty}× {it.product_name}</span>
            <span className="shrink-0">{PKR(it.unit_price * it.qty)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-olive/20 pt-4 text-sm">
        <div className="flex justify-between font-medium text-ink">
          <span>Subtotal</span>
          <span>{PKR(subtotal)}</span>
        </div>
        <div className="flex justify-between text-olive-dark text-xs">
          <span>Delivery fee</span>
          <span className="italic">To be confirmed</span>
        </div>
        <div className="flex justify-between pt-3 text-lg font-display text-ink border-t border-olive/20">
          <span>Total</span>
          <span className="text-burgundy">{PKR(subtotal)}</span>
        </div>
      </div>
      
      <p className="mt-4 text-[11px] leading-tight text-olive-dark/80">
        * Delivery charges will be agreed upon via WhatsApp based on your location in Chittagong.
      </p>
    </div>
  );
}