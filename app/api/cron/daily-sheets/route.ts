import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendTelegramMessage } from '@/lib/telegram';

export async function GET(req: Request) {
  // 1. Security check
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const sb = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  // 2. Fetch today's orders (excluding cancelled/delivered)
  const { data: orders, error } = await sb
    .from('orders')
    .select('reference, customer_name, preferred_time, order_items(product_name, qty, size_label, cake_message)')
    .eq('delivery_date', today)
    .neq('status', 'cancelled')
    .neq('status', 'delivered')
    .order('preferred_time');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ message: 'No orders today' });
  }

  // 3. Format the baking sheet
  const lines = orders.map((o) => {
    const items = o.order_items
      .map((it: any) => `   - ${it.qty}x ${it.product_name} (${it.size_label}) ${it.cake_message ? `✍️ "${it.cake_message}"` : ''}`)
      .join('\n');
    return `🕒 *${o.preferred_time}* - ${o.customer_name} (${o.reference})\n${items}`;
  });

  const message = `🍰 *Baking Sheet — ${today}*\n\n${lines.join('\n\n')}`;

  // 4. Send to Telegram
  await sendTelegramMessage(message);

  return NextResponse.json({ success: true, count: orders.length });
}