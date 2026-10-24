'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const STATUSES = [
  { key: 'confirmed', label: 'Confirm Order', color: 'bg-olive text-cream' },
  { key: 'baking', label: 'Baking', color: 'bg-[#d98e3a] text-white' }, // Orange
  { key: 'out_for_delivery', label: 'Out for Delivery', color: 'bg-[#3b82f6] text-white' }, // Blue
  { key: 'delivered', label: 'Delivered', color: 'bg-green-600 text-white' },
  { key: 'cancelled', label: 'Cancel Order', color: 'bg-burgundy text-cream' },
];

export function StatusButtons({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const sb = createClient();
  const [loading, setLoading] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    if (newStatus === currentStatus) return;
    
    // Confirm before cancelling
    if (newStatus === 'cancelled' && !confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setLoading(newStatus);
    
    // Update order status
    const { error } = await sb
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      alert('Failed to update status: ' + error.message);
      setLoading(null);
      return;
    }

    // Log the status change (optional, but good for history)
    await sb.from('order_status_log').insert({
      order_id: orderId,
      status: newStatus
    });

    // Refresh the page to show the new status
    router.refresh();
    setLoading(null);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map((s) => {
        // Don't show button for current status
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
