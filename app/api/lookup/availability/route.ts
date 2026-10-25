import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const sb = createAdminClient();

  // 1. Get the max limit setting
  const { data: setting } = await sb.from('settings').select('value').eq('key', 'max_orders_per_day').single();
  const maxOrders = Number(setting?.value) || 5;

  // 2. Get all orders for the next 60 days (excluding cancelled)
  const today = new Date().toISOString().split('T')[0];
  const { data: orders } = await sb
    .from('orders')
    .select('delivery_date')
    .gte('delivery_date', today)
    .neq('status', 'cancelled');

  // 3. Count orders per day
  const counts: Record<string, number> = {};
  (orders ?? []).forEach(o => {
    counts[o.delivery_date] = (counts[o.delivery_date] || 0) + 1;
  });

  // 4. Find full dates
  const blockedDates = Object.keys(counts).filter(date => counts[date] >= maxOrders);

  return NextResponse.json({ blockedDates, maxOrders });
}