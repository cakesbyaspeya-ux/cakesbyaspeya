import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export default async function AdminOrdersList() {
  const sb = await createServerClient();
  
  const { data: orders } = await sb
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl text-ink mb-8">All Orders</h1>

      <div className="space-y-3">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <Link 
              key={order.reference} 
              href={`/admin/orders/${order.reference}`}
              className="block rounded-2xl bg-cream-card p-4 ring-1 ring-black/5 hover:ring-burgundy/30 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-burgundy">{order.reference}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                      order.status === 'new' ? 'bg-burgundy text-cream' : 'bg-olive/10 text-olive-dark'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-medium text-ink mt-1">{order.customer_name} · {order.phone}</p>
                  <p className="text-sm text-olive-dark">
                    {order.delivery_date} · {order.delivery_method === 'delivery' ? order.area : 'Pickup'}
                  </p>
                </div>
                <div className="text-right sm:text-left">
                  <p className="text-sm font-medium">৳{Number(order.subtotal).toLocaleString()}</p>
                  <p className="text-xs text-olive-dark">Subtotal</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="rounded-2xl bg-cream-card p-8 text-center text-olive-dark ring-1 ring-black/5">
            No orders found.
          </p>
        )}
      </div>
    </div>
  );
}