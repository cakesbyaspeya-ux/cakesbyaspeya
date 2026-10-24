import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createAdminClient } from '@/lib/supabase/admin'; // 👈 Use Admin client to bypass RLS

const STEPS = ['New', 'Confirmed', 'Baking', 'Out for delivery', 'Delivered'] as const;
const MAP: Record<string, number> = {
  new: 0, confirmed: 1, baking: 2, out_for_delivery: 3, delivered: 4, cancelled: -1,
};

export default async function TrackPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  
  // Use Admin client so customers can see their order without logging in
  const sb = createAdminClient(); 
  
  const { data: order } = await sb
    .from('orders')
    .select('*, order_items(*)')
    .eq('reference', ref)
    .single();
    
  if (!order) notFound();
  
  if (order.status === 'cancelled') {
    return (
      <main className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl text-ink">Order {ref}</h1>
        <p className="mt-3 text-burgundy">This order was cancelled. Please contact us on WhatsApp.</p>
      </main>
    );
  }
  
  const idx = MAP[order.status] ?? 0;

  return (
    <main className="mx-auto max-w-2xl px-4 py-12 md:py-16">
      <div className="text-center mb-8">
        <p className="text-sm font-medium text-olive-dark uppercase tracking-wider mb-1">Order Status</p>
        <h1 className="font-display text-3xl text-ink">{order.reference}</h1>
        <p className="mt-1 text-sm text-olive-dark">For {order.delivery_date} · {order.preferred_time}</p>
      </div>

      <div className="rounded-3xl bg-cream-card p-6 md:p-8 ring-1 ring-black/5 shadow-soft mb-8">
        <ol className="space-y-6">
          {STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-4">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                i <= idx ? 'bg-olive text-cream' : 'bg-cream-dark text-olive-dark'
              }`}>
                {i < idx ? '✓' : i + 1}
              </span>
              <div>
                <span className={`text-lg font-medium ${i <= idx ? 'text-ink' : 'text-olive-dark'}`}>{s}</span>
                {i === idx && <p className="text-xs text-burgundy font-medium mt-0.5 animate-pulse">Current Status</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Your Items</h2>
        <ul className="space-y-3">
          {order.order_items.map((it: any) => (
            <li key={it.id} className="flex gap-3 text-sm">
              <span className="font-medium text-ink">{it.qty}×</span>
              <div>
                <p className="font-medium text-ink">{it.product_name}</p>
                {it.design_label && <p className="text-xs text-burgundy">{it.design_label}</p>}
                <p className="text-xs text-olive-dark">{[it.size_label, it.flavour].filter(Boolean).join(' · ')}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link href="/" className="text-sm text-olive-dark hover:text-burgundy hover:underline">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}