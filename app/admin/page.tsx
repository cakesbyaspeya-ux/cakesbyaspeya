import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export default async function AdminDashboard() {
  const sb = await createServerClient();
  const today = new Date().toISOString().split('T')[0];

  // Fetch counts
  const { count: newOrders } = await sb.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const { count: todayOrders } = await sb.from('orders').select('*', { count: 'exact', head: true }).eq('delivery_date', today);

  // Fetch recent 5 orders
  const { data: recentOrders } = await sb
    .from('orders')
    .select('reference, customer_name, delivery_date, status')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 mb-10">
        <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">New Orders</p>
          <p className="font-display text-4xl text-burgundy">{newOrders || 0}</p>
          <Link href="/admin/orders" className="mt-4 inline-block text-sm text-burgundy hover:underline">
            Manage orders →
          </Link>
        </div>
        <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">Deliveries Today</p>
          <p className="font-display text-4xl text-olive">{todayOrders || 0}</p>
        </div>
      </div>

      <h2 className="font-display text-2xl text-ink mb-4">Recent Orders</h2>
      <div className="rounded-2xl bg-cream-card ring-1 ring-black/5 overflow-hidden">
        {recentOrders && recentOrders.length > 0 ? (
          <ul className="divide-y divide-olive/10">
            {recentOrders.map(o => (
              <li key={o.reference} className="p-4 flex items-center justify-between hover:bg-cream-dark/30">
                <div>
                  <p className="font-medium text-ink">{o.reference} · {o.customer_name}</p>
                  <p className="text-xs text-olive-dark">For: {o.delivery_date}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  o.status === 'new' ? 'bg-burgundy text-cream' : 'bg-olive/10 text-olive-dark'
                }`}>
                  {o.status}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-sm text-olive-dark">No orders yet.</p>
        )}
      </div>
    </div>
  );
}