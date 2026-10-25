import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) return NextResponse.json({ error: 'Enter a code' }, { status: 400 });

    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: promo } = await sb
      .from('promo_codes')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!promo) return NextResponse.json({ error: 'Invalid or expired code' }, { status: 404 });

    if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This code has expired' }, { status: 400 });
    }

    if (Number(promo.min_order_value) > subtotal) {
      return NextResponse.json({ error: `Minimum order ৳${promo.min_order_value} required` }, { status: 400 });
    }

    let discount = 0;
    if (promo.discount_type === 'percentage') {
      discount = (subtotal * Number(promo.discount_value)) / 100;
    } else {
      discount = Number(promo.discount_value);
    }

    if (discount > subtotal) discount = subtotal;

    return NextResponse.json({ 
      valid: true, 
      code: promo.code, 
      discount: Math.round(discount) 
    });

  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}