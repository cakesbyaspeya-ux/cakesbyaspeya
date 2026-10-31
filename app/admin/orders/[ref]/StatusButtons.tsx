'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STATUSES = [
  { key: 'confirmed', label: 'Confirm Order', color: 'bg-olive text-cream' },
  { key: 'baking', label: 'Baking', color: 'bg-[#d98e3a] text-white' },
  { key: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-[#3b82f6] text-white' },
  { key: 'delivered', label: 'Delivered', color: 'bg-green-600 text-white' },
  { key: 'cancelled', label: 'Cancel Order', color: 'bg-burgundy text-cream' },
];

export function StatusButtons({ 
  orderId, 
  orderRef, 
  currentStatus 
}: { 
  orderId: string; 
  orderRef: string; 
  currentStatus: string; 
}) {
  const router = useRouter();
  const sb = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return;
    
    if (newStatus === 'cancelled' && !confirm('Are you sure you want to cancel this order?')) return;

    setLoading(newStatus);
    
    const { error } = await sb
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Failed to update status: ' + error.message);
      setLoading(null);
      return;
    }

    await sb.from('order_status_log').insert({
      order_id: orderId,
      status: newStatus
    });

    // 🔔 Trigger Push Notification based on status
    let pushTitle = '';
    let pushBody = '';
    
    if (newStatus === 'baking') {
      pushTitle = '👩‍🍳 Your cake is in the oven!';
      pushBody = `We have started baking your order (${orderRef}).`;
    } else if (newStatus === 'out_for_delivery') {
      pushTitle = '🚚 Out for Delivery!';
      pushBody = `Your cake is on its way. Please keep your phone nearby!`;
    } else if (newStatus === 'delivered') {
      pushTitle = '🎉 Order Delivered!';
      pushBody = `Hope you love it! Please leave us a review on the site.`;
    }

    if (pushTitle) {
      fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          orderRef, 
          title: pushTitle, 
          body: pushBody,
          url: `https://cakesbyaspeya.vercel.app/track/${orderRef}` 
        })
      }).catch(console.error);
    }

    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => {
        if (s.key === currentStatus) return null;

        return (
          <button
            key={s.key}
            onClick={() => updateStatus(s.key)}
            disabled={loading !== null}
            className={`rounded-xl px-4 py-2.5 text-sm font-medium transition hover:brightness-95 disabled:opacity-50 ${s.color}`}
          >
            {loading === s.key ? 'Updating...' : s.label}
          </button>
        );
      })}
    </div>
  );
}