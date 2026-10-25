'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartList } from '@/components/checkout/CartList';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CheckoutSummaryPage() {
  const router = useRouter();
  const { items, upsells, promoCode, discountAmount, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
    const saved = sessionStorage.getItem('cba_checkout_info');
    if (!saved) router.push('/checkout/info');
    else setInfo(JSON.parse(saved));
  }, [items, router]);

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);

    const payload = {
      ...info,
      promo_code: promoCode,
      discount_amount: discountAmount,
      final_total: total,
      items: items.map(it => ({
        product_id: it.product_id, product_name: it.product_name, design_id: it.design_id,
        design_label: it.design_label, image: it.image, custom_design_url: it.custom_design_url,
        flavour: it.flavour, size_label: it.size_label, cake_message: it.cake_message,
        unit_price: it.unit_price, qty: it.qty,
      })),
      upsells: upsells.map(u => ({ id: u.id, name: u.name, price: u.price, qty: u.qty }))
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to place order');

      sessionStorage.setItem('cba_last_order', JSON.stringify({ ref: json.reference, waUrl: json.waUrl }));
      clear();
      sessionStorage.removeItem('cba_checkout_info');
      
      router.push(`/order-confirmed/${json.reference}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!info || items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Link href="/checkout/info" className="text-sm font-medium text-olive-dark hover:text-burgundy mb-6 inline-block">← Edit Customer Info</Link>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Review & Place Order</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          
          {/* Delivery Recap Card */}
          <div className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
            <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Delivering To</h2>
            <p className="font-medium text-ink">{info.name} · {info.phone}</p>
            <p className="text-sm text-olive-dark mt-1">{info.method === 'pickup' ? 'Store Pickup' : `${info.area} - ${info.address}`}</p>
            <p className="text-sm text-olive-dark mt-1">Scheduled: {info.date} at {info.time}</p>
            {info.instructions && <p className="text-sm italic text-burgundy mt-2">Note: "{info.instructions}"</p>}
          </div>

          {/* Cart Items */}
          <CartList />
          
          {error && <div className="rounded-xl bg-burgundy/10 p-4 text-sm text-burgundy">{error}</div>}

          <div className="flex justify-end pt-4">
            <button 
              onClick={handlePlaceOrder} 
              disabled={loading}
              className="w-full sm:w-auto rounded-full bg-whatsapp px-8 py-4 text-lg font-medium text-white shadow hover:brightness-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Processing...' : 'Confirm & Place Order →'}
            </button>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}