'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartList } from '@/components/checkout/CartList';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CheckoutSummaryPage() {
  const router = useRouter();
  const { items, upsells, promoCode, discountAmount, total } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<any>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // If cart is empty, go back to cart page
    if (items.length === 0) {
      router.replace('/cart');
      return;
    }

    // Check if customer info exists
    const saved = sessionStorage.getItem('cba_checkout_info');
    if (!saved) {
      router.replace('/checkout/info');
    } else {
      setInfo(JSON.parse(saved));
    }
  }, [items.length, router]);

  async function handlePlaceOrder() {
    setLoading(true);
    setError(null);

    const payload = {
      customer_name: info.name,
      phone: info.phone,
      whatsapp: info.whatsapp,
      delivery_method: info.method,
      delivery_date: info.date,
      preferred_time: info.time,
      area: info.area,
      address: info.address,
      pickup_location: info.pickup_location,
      special_instructions: info.instructions,
      cake_message: info.cake_message,
      
      // 👇 FIX: Send subtotal without delivery fee, and send delivery fee separately
      subtotal: total, // `total` from useCart is just items - discount
      delivery_fee: info.delivery_fee || 0,
      
      promo_code: promoCode,
      discount_amount: discountAmount,
      
      items: items.map(it => ({
        product_id: it.product_id, 
        product_name: it.product_name, 
        design_id: it.design_id,
        design_label: it.design_label, 
        image: it.image, 
        custom_design_url: it.custom_design_url,
        flavour: it.flavour, 
        size_label: it.size_label, 
        cake_message: it.cake_message,
        unit_price: it.unit_price, 
        qty: it.qty,
      })),
      upsells: upsells.map(u => ({ id: u.id, name: u.name, price: u.price, qty: u.qty }))
    };
    try {
      const res = await fetch('/api/orders', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to place order');

      // Save order ref and redirect to success page
      sessionStorage.setItem('cba_last_order', JSON.stringify({ ref: json.reference, waUrl: json.waUrl }));
      
      // Note: We intentionally DO NOT clear the cart here. 
      // The OrderSuccessClient page will handle clearing the cart and sessionStorage.
      
      router.push(`/order-confirmed/${json.reference}`);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  if (!isMounted || (!info && items.length > 0)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-olive border-t-transparent"></div>
        <p className="mt-4 text-sm text-olive-dark">Loading your order...</p>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <Link href="/checkout/info" className="text-sm font-medium text-olive-dark hover:text-burgundy mb-6 inline-block">
        ← Edit Customer Info
      </Link>
      
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Review & Confirm Order</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        
        {/* ── LEFT COLUMN: Info & Items ── */}
        <div className="space-y-6">
          
          {/* 1. Customer Info Recap */}
          <div className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
            <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Check Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-olive-dark uppercase tracking-wide font-medium mb-1">Contact</p>
                <p className="font-medium text-ink">{info.name}</p>
                <p className="text-sm text-olive-dark">{info.phone}</p>
                {info.whatsapp && info.whatsapp !== info.phone && (
                  <p className="text-sm text-olive-dark">WA: {info.whatsapp}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-olive-dark uppercase tracking-wide font-medium mb-1">
                  {info.method === 'pickup' ? 'Pickup Schedule' : 'Delivery Details'}
                </p>
                <p className="font-medium text-ink">{info.date} at {info.time}</p>
                {info.method === 'pickup' ? (
                  <p className="text-sm text-olive-dark">
                    Store Pickup: <strong>{info.pickup_location}</strong>
                  </p>
                ) : (
                  <p className="text-sm text-olive-dark">{info.area} - {info.address}</p>
                )}
              </div>
            </div>

            {/* Global Cake Message */}
            {info.cake_message && (
              <div className="mt-4 pt-4 border-t border-olive/10">
                <p className="text-xs text-olive-dark uppercase tracking-wide font-medium mb-1">Cake Message</p>
                <p className="text-lg font-handwriting text-burgundy font-bold">&quot;{info.cake_message}&quot;</p>
              </div>
            )}

            {info.instructions && (
              <div className="mt-4 pt-4 border-t border-olive/10">
                <p className="text-xs text-olive-dark uppercase tracking-wide font-medium mb-1">Special Instructions</p>
                <p className="text-sm italic text-burgundy">&quot;{info.instructions}&quot;</p>
              </div>
            )}
          </div>

          {/* 2. Order Items */}
          <div>
            <h2 className="font-display text-lg mb-3">Your Items</h2>
            <CartList />
          </div>

        </div>

        {/* ── RIGHT COLUMN: Promo & Summary ── */}
        <aside className="lg:sticky lg:top-24 h-fit flex flex-col gap-4">
          
          {/* 3. Promo Code & Payment Summary */}
          <OrderSummary />

          {error && <div className="rounded-xl bg-burgundy/10 p-4 text-sm text-burgundy">{error}</div>}

          {/* 4. Confirm Order Button (Visible on Desktop) */}
          <button 
            type="button"
            onClick={handlePlaceOrder} 
            disabled={loading}
            className="hidden lg:flex w-full rounded-full bg-whatsapp px-8 py-4 text-lg font-medium text-white shadow hover:brightness-95 disabled:opacity-50 transition items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Confirm Order →'}
          </button>
        </aside>
      </div>

      {/* 4. Confirm Order Button (Visible on Mobile at the bottom) */}
      <div className="mt-8 lg:hidden">
        <button 
          type="button"
          onClick={handlePlaceOrder} 
          disabled={loading}
          className="w-full rounded-full bg-whatsapp px-8 py-4 text-lg font-medium text-white shadow hover:brightness-95 disabled:opacity-50 transition flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : 'Confirm Order →'}
        </button>
      </div>

    </div>
  );
}