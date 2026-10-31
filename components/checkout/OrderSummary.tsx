'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/CartProvider';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function OrderSummary() {
  const { subtotal, items, upsells, promoCode, discountAmount, applyPromo, removePromo } = useCart();
  const [codeInput, setCodeInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Fetch checkout method from session storage to show delivery fee
  const [isDelivery, setIsDelivery] = useState(false);
  
  useEffect(() => {
    const saved = sessionStorage.getItem('cba_checkout_info');
    if (saved) {
      const info = JSON.parse(saved);
      setIsDelivery(info.method === 'delivery');
    }
  }, []);

  const deliveryFee = isDelivery ? 70 : 0;
  const finalTotal = Math.max(0, subtotal - discountAmount) + deliveryFee;

  async function handleApplyCode() {
    if (!codeInput.trim()) return;
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/lookup/promo', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeInput, subtotal })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      applyPromo(data.code, data.discount);
      setCodeInput('');
    } catch (err: any) { setError(err.message); } finally { setLoading(false); }
  }

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
        {upsells.map((u) => (
          <div key={u.id} className="flex justify-between gap-3 text-burgundy/80 italic">
            <span className="truncate">{u.qty}× {u.name}</span>
            <span className="shrink-0">{PKR(u.price * u.qty)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-olive/20 pt-4 pb-4">
        {!promoCode ? (
          <div className="flex gap-2">
            <input type="text" placeholder="Promo code" value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} className="input py-2 text-sm uppercase flex-1" />
            <button onClick={handleApplyCode} disabled={loading || !codeInput} className="rounded-lg bg-olive px-4 text-sm font-medium text-cream hover:bg-olive-dark transition disabled:opacity-50">Apply</button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg bg-olive/10 px-3 py-2 border border-olive/20">
            <span className="text-sm font-medium text-olive-dark">🎟️ {promoCode} applied!</span>
            <button onClick={removePromo} className="text-xs text-burgundy hover:underline">Remove</button>
          </div>
        )}
        {error && <p className="mt-2 text-xs text-burgundy">{error}</p>}
      </div>

      <div className="space-y-2 border-t border-olive/20 pt-4 text-sm">
        <div className="flex justify-between text-olive-dark">
          <span>Subtotal</span>
          <span>{PKR(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-burgundy font-medium">
            <span>Discount</span>
            <span>-{PKR(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-olive-dark">
          <span>Delivery Fee</span>
          <span>{isDelivery ? PKR(70) : 'Free (Pickup)'}</span>
        </div>
        <div className="flex justify-between pt-3 text-lg font-display text-ink border-t border-olive/20">
          <span>Total</span>
          <span className="text-burgundy">{PKR(finalTotal)}</span>
        </div>
      </div>
    </div>
  );
}