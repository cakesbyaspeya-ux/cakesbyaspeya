import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { StatusButtons } from './StatusButtons';
import { CopyLinkButton } from './CopyLinkButton';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export default async function OrderDetailPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const sb = await createServerClient();

  const { data: order, error } = await sb
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_upsells (*)
    `)
    .eq('reference', ref)
    .single();

  if (error || !order) {
    notFound();
  }

  const isPickup = order.delivery_method === 'pickup';
  const waPhone = order.whatsapp.replace(/\D/g, '').replace(/^0/, '880');
  const waLink = `https://wa.me/${waPhone}`;
  
  const orderItems = order.order_items || [];
  const cakeMessages = orderItems.filter((item: any) => item.cake_message && item.cake_message.trim() !== '');

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
              {order.status.replace('_', ' ')}
            </span>
          </div>
          <p className="text-sm text-olive-dark mt-1">
            Placed on {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <CopyLinkButton reference={order.reference} />
          
          <a 
            href={waLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="rounded-full bg-whatsapp px-6 py-2.5 text-sm font-medium text-white hover:brightness-95 transition text-center"
          >
            Message Customer
          </a>

          <Link 
            href={`/admin/orders/${order.reference}/print`}
            className="rounded-full border border-olive/30 px-6 py-2.5 text-sm font-medium text-olive-dark hover:bg-olive hover:text-cream transition text-center"
          >
            🖨️ Print Receipt
          </Link>
        </div>
      </div>

      {/* 🚨 DEDICATED CAKE MESSAGE SECTION 🚨 */}
      {cakeMessages.length > 0 && (
        <div className="mb-8 rounded-2xl bg-burgundy/5 p-6 ring-1 ring-burgundy/20">
          <h2 className="font-display text-xl text-burgundy border-b border-burgundy/20 pb-2 mb-4 flex items-center gap-2">
            ✍️ Cake Messages (Please Write on Cake)
          </h2>
          <ul className="space-y-4">
            {cakeMessages.map((item: any, idx: number) => (
              <li key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-burgundy/10">
                <p className="text-2xl font-display text-ink italic mb-2">&quot;{item.cake_message}&quot;</p>
                <p className="text-xs text-olive-dark uppercase tracking-wide font-medium">
                  — For {item.qty}x {item.product_name} {item.size_label ? `(${item.size_label})` : ''}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

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
            <div className="mt-4 rounded-lg bg-olive/5 p-3 border border-olive/10">
              <p className="text-xs font-medium text-olive-dark mb-1">Special Instructions:</p>
              <p className="text-sm text-ink italic">&quot;{order.special_instructions}&quot;</p>
            </div>
          )}
        </section>
      </div>

      {/* Order Items List */}
      <section className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 mb-8">
        <h2 className="font-display text-lg border-b border-olive/20 pb-2 mb-3">Items Ordered</h2>
        <ul className="space-y-4">
          {orderItems.map((item: any) => (
            <li key={item.id} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <p className="font-medium text-ink">{item.qty}× {item.product_name}</p>
                <div className="text-sm text-olive-dark mt-1 space-y-0.5">
                  {item.design_label && <p className="text-burgundy font-medium">{item.design_label}</p>}
                  {item.variant && <p>Type: {item.variant}</p>}
                  {item.flavour && <p>Flavour: {item.flavour}</p>}
                  {item.size_label && <p>Size: {item.size_label}</p>}
                  
                  {item.custom_design_url && (
                    <div className="mt-2">
                      <a href={item.custom_design_url} target="_blank" rel="noopener noreferrer" className="inline-block text-xs font-bold text-burgundy hover:underline bg-burgundy/5 px-2 py-1 rounded">
                        🖼️ View Uploaded Design
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <p className="font-medium text-ink shrink-0">{PKR(Number(item.line_total))}</p>
            </li>
          ))}
        </ul>
        
        {/* Extras / Upsells */}
        {order.order_upsells && order.order_upsells.length > 0 && (
          <div className="mt-6 border-t border-olive/10 pt-4">
            <h3 className="text-sm font-medium text-olive-dark mb-2">Extras / Decorations:</h3>
            <ul className="space-y-1">
              {order.order_upsells.map((u: any) => (
                <li key={u.id} className="text-sm text-ink flex justify-between">
                  <span>{u.qty}× {u.upsell_name}</span>
                  <span className="text-olive-dark">{PKR(Number(u.unit_price * u.qty))}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Totals */}
        <div className="border-t border-olive/20 mt-4 pt-4 space-y-2">
          {Number(order.discount_amount) > 0 && (
            <div className="flex justify-between text-sm text-burgundy">
              <p>Discount ({order.promo_code})</p>
              <p>-{PKR(Number(order.discount_amount))}</p>
            </div>
          )}
          <div className="flex justify-between font-medium">
            <p className="text-olive-dark">Total</p>
            <p className="text-burgundy text-lg">{PKR(Number(order.subtotal))}</p>
          </div>
        </div>
      </section>

      {/* Status Update Buttons */}
      <section className="rounded-2xl bg-cream p-1">
        <h3 className="text-sm font-medium text-olive-dark mb-3 px-1">Update Order Status:</h3>
        <StatusButtons 
          orderId={order.id} 
          orderRef={order.reference} 
          currentStatus={order.status} 
        />
      </section>
    </div>
  );
}