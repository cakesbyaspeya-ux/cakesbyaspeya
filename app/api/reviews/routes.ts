import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  try {
    const { reference, product_id, customer_name, rating, comment } = await req.json();
    const sb = createAdminClient();

    // 1. Verify the order exists and is delivered
    const { data: order } = await sb.from('orders').select('status').eq('reference', reference).single();
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    if (order.status !== 'delivered') {
      return NextResponse.json({ error: 'You can only review delivered orders' }, { status: 400 });
    }

    // 2. Save the review
    const { error } = await sb.from('reviews').insert({
      product_id,
      order_reference: reference,
      customer_name,
      rating: Number(rating),
      comment,
    });

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
