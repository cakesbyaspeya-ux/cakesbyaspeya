import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { generateReference, buildOrderMessage, whatsappUrl } from '@/lib/whatsapp';
import { sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sb = createAdminClient();
    
    const reference = generateReference();
    const subtotal = body.items.reduce((sum: number, item: any) => sum + (item.unit_price * item.qty), 0) 
                   + (body.upsells || []).reduce((sum: number, u: any) => sum + (u.price * u.qty), 0);

    // 1. Save order
    const { data: order, error: orderError } = await sb
      .from('orders')
      .insert({
        reference,
        customer_name: body.customer_name,
        phone: body.phone,
        whatsapp: body.whatsapp,
        delivery_method: body.delivery_method,
        delivery_date: body.delivery_date,
        preferred_time: body.preferred_time,
        area: body.delivery_method === 'delivery' ? body.area : null,
        address: body.delivery_method === 'delivery' ? body.address : null,
        special_instructions: body.special_instructions || null,
        subtotal,
        status: 'new'
      })
      .select('id')
      .single();

    if (orderError) throw new Error(orderError.message);

    // 2. Save order items
    const orderItems = body.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.product_name,
      design_id: item.design_id || null,    
      design_url: item.image || null,       
      flavour: item.flavour,
      size_label: item.size_label,
      cake_message: item.cake_message,
      unit_price: item.unit_price,
      qty: item.qty,
      line_total: item.unit_price * item.qty,
    }));

    const { error: itemsError } = await sb.from('order_items').insert(orderItems);
    if (itemsError) throw new Error(itemsError.message);

    // 3. Save Upsells (Decorations)
    if (body.upsells && body.upsells.length > 0) {
      const orderUpsells = body.upsells.map((u: any) => ({
        order_id: order.id,
        upsell_name: u.name,
        unit_price: u.price,
        qty: u.qty
      }));
      const { error: upsellError } = await sb.from('order_upsells').insert(orderUpsells);
      if (upsellError) throw new Error(upsellError.message);
    }

    // 🔔 Telegram Alert
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.vercel.app';
    const trackingLink = `${siteUrl}/track/${reference}`;

    const telegramText = `
🎂 *New Order: ${reference}*

👤 *Customer:* ${body.customer_name}
📞 *Phone:* ${body.phone}
📅 *Date:* ${body.delivery_date} at ${body.preferred_time}
${body.delivery_method === 'delivery' ? `📍 *Area:* ${body.area}` : '🏪 *Pickup*'}

📦 *Items:*
${orderItems.map((item: any) => `- ${item.qty}x ${item.product_name}`).join('\n')}
${body.upsells?.length ? `\n✨ *Extras:*\n${body.upsells.map((u:any) => `- ${u.qty}x ${u.name}`).join('\n')}` : ''}

💰 *Subtotal:* ৳${subtotal.toLocaleString('en-BD')}

🔗 [Click to view order](${trackingLink})
    `;
    await sendTelegramMessage(telegramText);

    // 4. Build WhatsApp Message
    const message = buildOrderMessage(
      {
        reference,
        customer_name: body.customer_name,
        phone: body.phone,
        whatsapp: body.whatsapp,
        delivery_method: body.delivery_method,
        delivery_date: body.delivery_date,
        preferred_time: body.preferred_time,
        area: body.area,
        address: body.address,
        special_instructions: body.special_instructions,
        subtotal,
        items: orderItems,
        upsells: body.upsells || []
      },
      'Sanmar Ocean City / 2 No Gate / Women College Mor, Chittagong'
    );

    const waUrl = whatsappUrl(message);
    return NextResponse.json({ success: true, reference, waUrl });
    
  } catch (error: any) {
    console.error('Order API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}