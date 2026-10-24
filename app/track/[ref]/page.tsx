import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';

const STEPS = ['Confirmed', 'Baking', 'Out for Delivery', 'Delivered'];
const MAP: Record<string, number> = {
  new: 0, confirmed: 0, baking: 1, out_for_delivery: 2, delivered: 3, cancelled: -1,
};

export default async function TrackPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const sb = await createServerClient();
  
  const { data: order } = await sb
    .from('orders')
    .select('*, order_items(*)')
    .eq('reference', ref)
    .single();

  if (!order) notFound();

  if (order.status === 'cancelled') {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-burgundy mb-2">Order Cancelled</h1>
        <p className="text-olive-dark">This order ({ref}) was cancelled. Please contact us on WhatsApp.</p>
        <Link href="/" className="mt-6 inline-block text-burgundy hover:underline">Back to home</Link>
      </div>
    );
  }

  const currentStep = MAP[order.status] ?? 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl text-ink">Order Status</h1>
        <p className="text-olive-dark mt-2 font-mono text-sm">{order.reference}</p>
      </div>

      {/* Timeline */}
      <div className="relative border-l-2 border-olive/20 ml-4 md:ml-0 md:border-l-0 space-y-8">
        {STEPS.map((step, i) => {
          const active = i <= currentStep;
          return (
            <div key={step} className="relative pl-8 md:pl-0 md:text-center md:flex-1">
              <div className={`absolute left-[-9px] top-1 h-4 w-4 rounded-full md:static md:mx-auto md:mb-3 ${
                active ? 'bg-burgundy' : 'bg-cream-dark border-2 border-olive/30'
              }`} />
              <p className={`font-medium ${active ? 'text-ink' : 'text-olive-dark/50'}`}>{step}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <h2 className="font-display text-xl border-b border-olive/20 pb-3 mb-4">Order Details</h2>
        <p className="text-sm text-olive-dark mb-4">
          {order.delivery_method === 'delivery' ? 'Delivering to:' : 'Pickup on:'} <strong className="text-ink">{order.delivery_date}</strong> at {order.preferred_time}
        </p>
        <ul className="space-y-3">
          {order.order_items.map((item: any) => (
            <li key={item.id} className="flex justify-between text-sm">
              <span>{item.qty}x {item.product_name} {item.size_label && `(${item.size_label})`}</span>
              <span className="text-olive-dark">৳{Number(item.line_total).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-center">
         <p className="text-sm text-olive-dark">Need to ask a question?</p>
         <a href={`https://wa.me/8801519409555?text=Hi, I have a question about order ${order.reference}`} className="mt-2 inline-block rounded-full bg-whatsapp px-6 py-2 text-sm text-white font-medium hover:brightness-95">
            Message us on WhatsApp
         </a>
      </div>
    </div>
  );
}
