import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { RevenueChart } from './RevenueChart';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export default async function AdminDashboard() {
  const sb = await createServerClient();
  const today = new Date().toISOString().split('T')[0];

  // 1. Basic Counts
  const { count: newOrders } = await sb.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'new');
  const { count: todayOrders } = await sb.from('orders').select('*', { count: 'exact', head: true }).eq('delivery_date', today);

  // 2. Fetch recent 5 orders
  const { data: recentOrders } = await sb
    .from('orders')
    .select('reference, customer_name, delivery_date, status, subtotal')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Calculate Total Revenue & Top Sellers (All time)
  const { data: allOrders } = await sb
    .from('orders')
    .select('subtotal, created_at')
    .neq('status', 'cancelled');
    
  const totalRevenue = (allOrders ?? []).reduce((sum, order) => sum + Number(order.subtotal), 0);

  const { data: items } = await sb
    .from('order_items')
    .select('product_name, qty, orders!inner(status)')
    .neq('orders.status', 'cancelled');
    
  const productSales: Record<string, number> = {};
  (items ?? []).forEach((item: any) => {
    productSales[item.product_name] = (productSales[item.product_name] || 0) + item.qty;
  });
  
  const topSelling = Object.entries(productSales)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, 3);

  // 4. Prepare Data for the Charts (7 Days & 30 Days)
  const chartData7 = [];
  const chartData30 = [];

  // Loop 30 times to build both arrays
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    const dayRevenue = (allOrders ?? [])
      .filter(o => o.created_at.startsWith(dateStr))
      .reduce((sum, o) => sum + Number(o.subtotal), 0);
      
    const dataPoint = {
      name: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      revenue: dayRevenue
    };

    chartData30.push(dataPoint);

    // If it's within the last 7 days, also add to the 7-day array
    if (i < 7) {
      chartData7.push(dataPoint);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="font-display text-3xl text-ink">Dashboard</h1>

      {/* Top Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">New Orders</p>
          <p className="font-display text-4xl text-burgundy">{newOrders || 0}</p>
          <Link href="/admin/orders" className="mt-2 inline-block text-xs text-burgundy hover:underline">
            Manage orders →
          </Link>
        </div>
        <div className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">Deliveries Today</p>
          <p className="font-display text-4xl text-olive">{todayOrders || 0}</p>
        </div>
        <div className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">Total Revenue</p>
          <p className="font-display text-3xl text-ink mt-1">{PKR(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm">
          <p className="text-sm font-medium text-olive-dark mb-1">Top Seller</p>
          <p className="font-display text-lg text-ink mt-2 truncate">
            {topSelling[0]?.[0] || 'No data yet'}
          </p>
          <p className="text-xs text-burgundy mt-1 font-medium">{topSelling[0]?.[1] || 0} sold</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart (New Client Component) */}
        <RevenueChart data7={chartData7} data30={chartData30} />

        {/* Recent Orders */}
        <div className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 shadow-sm">
          <h2 className="font-display text-lg text-ink mb-4">Recent Orders</h2>
          {recentOrders && recentOrders.length > 0 ? (
            <ul className="space-y-3">
              {recentOrders.map(o => (
                <li key={o.reference} className="border-b border-olive/10 pb-3 last:border-0 last:pb-0">
                  <Link href={`/admin/orders/${o.reference}`} className="block group">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-ink group-hover:text-burgundy transition">{o.customer_name}</p>
                      <span className={`text-[10px] font-medium uppercase px-2 py-0.5 rounded-full ${
                        o.status === 'new' ? 'bg-burgundy text-cream' : 'bg-olive/10 text-olive-dark'
                      }`}>{o.status}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-olive-dark">
                      <span>{o.delivery_date}</span>
                      <span className="font-medium">{PKR(Number(o.subtotal))}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-olive-dark text-center mt-8">No orders yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}