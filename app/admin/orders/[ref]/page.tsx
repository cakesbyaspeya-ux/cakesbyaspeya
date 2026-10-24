import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { StatusButtons } from './StatusButtons';

export default async function OrderDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const sb = await createServerClient();

  // Fetch order and items
  const { data: order, error } = await sb
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('reference', ref)
    .single();

  if (error || !order) {
    notFound();
  }

  const isPickup = order.delivery_method === 'pickup';
  
  // Format WhatsApp link to message the customer directly
  const waPhone = order.whatsapp.replace(/\D/g, '').replace(/^0/, '880');
  const waLink = `https://wa.me/${waPhone}`;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin/orders" className="text-sm text-olive-dark hover:text-burgundy mb-6 inline-block">
        ← Back to orders
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-ink">{order.reference}</h1>
            <span className={`rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide ${
              order.status === 'new' ? 'bg-burgundy text-cream' : 'bg-olive/10 text-olive-dark'
            }`}>
              {order.status}
            </span>
          </div>
          <p className="text-sm text-olive-dark mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <a 
          href={waLink} 
          target="_blank" 
          rel="noopener noreferrer"
          className="rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-white hover:brightness-95 transition text-center"
        >
          Message Customer
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Customer Info */}
        <section className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5">
          <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Customer</h2>
          <p className="font-medium text-ink">{order.customer_name}</p>
          <p className="text-sm text-olive-dark mt-1">Phone: {order.phone}</p>
          <p className="text-sm text-olive-dark">WhatsApp: {order.whatsapp}</p>
        </section>

        {/* Delivery Info */}
        <section className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5">
          <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">
            {isPickup ? 'Pickup Info' : 'Delivery Info'}
          </h2>
          <p className="text-sm font-medium text-ink">
            {order.delivery_date} <span className="font-normal text-olive-dark">at</span> {order.preferred_time}
          </p>
          
          {isPickup ? (
            <p className="text-sm text-olive-dark mt-2 italic">Customer will pick up from shop.</p>
          ) : (
            <>
              <p className="text-sm text-olive-dark mt-2">
                <strong className="text-ink">Area:</strong> {order.area}
              </p>
              <p className="text-sm text-olive-dark mt-1">
                <strong className="text-ink">Address:</strong> {order.address}
              </p>
            </>
          )}

          {order.special_instructions && (
            <div className="mt-4 rounded-lg bg-burgundy/5 p-3 border border-burgundy/10">
              <p className="text-xs font-medium text-burgundy mb-1">Special Instructions:</p>
              <p className="text-sm text-ink italic">"{order.special_instructions}"</p>
            </div>
          )}
        </section>
      </div>

      {/* Order Items */}
      <section className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 mb-8">
        <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Items Ordered</h2>
        <ul className="space-y-4">
          {order.order_items.map((item: any) => (
            <li key={item.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{item.qty}× {item.product_name}</p>
                <div className="text-sm text-olive-dark mt-1 space-y-0.5">
                  {item.variant && <p>Type: {item.variant}</p>}
                  {item.flavour && <p>Flavour: {item.flavour}</p>}
                  {item.size_label && <p>Size: {item.size_label}</p>}
                  {item.cake_message && <p className="text-burgundy italic">Message: "{item.cake_message}"</p>}
                </div>
              </div>
              <p className="font-medium text-ink shrink-0">৳{Number(item.line_total).toLocaleString('en-BD')}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-olive/20 mt-4 pt-4 flex justify-between font-medium">
          <p className="text-olive-dark">Subtotal</p>
          <p className="text-burgundy text-lg">৳{Number(order.subtotal).toLocaleString('en-BD')}</p>
        </div>
      </section>

      {/* Status Update Buttons */}
      <section className="rounded-2xl bg-cream p-1">
        <h3 className="text-sm font-medium text-olive-dark mb-3 px-1">Update Order Status:</h3>
        <StatusButtons orderId={order.id} currentStatus={order.status} />
      </section>
    </div>
  );
}