import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { AdminDownloadReceiptButton } from '@/components/admin/AdminDownloadReceiptButton';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export default async function AdminOrdersList({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const sb = await createServerClient();
  
  // 👈 Updated query to fetch items and upsells so the PDF can be generated
  let query = sb
    .from('orders')
    .select('*, order_items(*), order_upsells(*)')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data: orders } = await query;
  const statuses = ['new', 'confirmed', 'baking', 'out_for_delivery', 'delivered', 'cancelled'];

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-3xl text-ink">Orders</h1>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link 
          href="/admin/orders" 
          className={`rounded-full border px-3 py-1 text-sm transition ${
            !status ? 'bg-burgundy text-cream border-burgundy' : 'border-olive/30 text-ink hover:bg-cream-dark'
          }`}
        >
          All
        </Link>
        {statuses.map(s => (
          <Link 
            key={s} 
            href={`/admin/orders?status=${s}`}
            className={`rounded-full border px-3 py-1 text-sm capitalize transition ${
              status === s ? 'bg-burgundy text-cream border-burgundy' : 'border-olive/30 text-ink hover:bg-cream-dark'
            }`}
          >
            {s.replace('_', ' ')}
          </Link>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {orders && orders.length > 0 ? (
          orders.map((order) => (
            <div 
              key={order.reference} 
              className="rounded-2xl bg-cream-card p-4 ring-1 ring-black/5 hover:ring-burgundy/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Left side: Clickable Info */}
              <Link href={`/admin/orders/${order.reference}`} className="flex-1 block group">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium text-burgundy group-hover:underline">{order.reference}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                    order.status === 'new' ? 'bg-burgundy text-cream' : 'bg-olive/10 text-olive-dark'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="font-medium text-ink mt-1">{order.customer_name} · {order.phone}</p>
                <p className="text-sm text-olive-dark">
                  {order.delivery_date} · {order.delivery_method === 'delivery' ? order.area : 'Pickup'}
                </p>
              </Link>

              {/* Right side: Price & Download Button */}
              <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-64">
                <div className="text-right">
                  <p className="text-sm font-medium">{PKR(Number(order.subtotal))}</p>
                  <p className="text-xs text-olive-dark">Total</p>
                </div>
                
                <AdminDownloadReceiptButton order={order} />
              </div>
            </div>
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