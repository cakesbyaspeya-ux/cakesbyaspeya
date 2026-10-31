export type OrderItemPayload = {
  product_name: string;
  design_label?: string | null; 
  flavour?: string | null;
  size_label?: string | null;
  cake_message?: string | null; // Kept for backward compatibility with older carts
  qty: number;
  line_total: number;
};

export type OrderPayload = {
  reference: string;
  customer_name: string;
  phone: string;
  whatsapp: string;
  delivery_method: 'delivery' | 'pickup';
  delivery_date: string;
  preferred_time: string;
  area?: string | null;
  address?: string | null;
  pickup_location?: string | null; // 👈 Added
  special_instructions?: string | null;
  cake_message?: string | null;    // 👈 Added
  delivery_fee?: number;           // 👈 Added
  subtotal: number;
  items: OrderItemPayload[];
  upsells?: any[];
};

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function buildOrderMessage(o: OrderPayload, defaultPickupAddress: string): string {
  // 1. Format Order Items
  const itemBlocks = o.items.map((it, i) => {
    const lines = [`${i + 1}. ${it.product_name} x${it.qty}`];
    if (it.design_label) lines.push(`   Design: ${it.design_label}`);
    if (it.flavour) lines.push(`   Flavour: ${it.flavour}`);
    if (it.size_label) lines.push(`   Size/weight: ${it.size_label}`);
    // If an item has a specific message (old carts), print it here
    if (it.cake_message?.trim()) lines.push(`   Cake message: ${it.cake_message.trim()}`);
    return lines.join('\n');
  }).join('\n');

  // 2. Format Upsells
  const upsellBlock = o.upsells && o.upsells.length > 0
    ? `\n\n✨ EXTRAS\n${o.upsells.map((u, i) => `${i + 1}. ${u.name} x${u.qty}`).join('\n')}`
    : '';

  // 3. Format Delivery Info
  const isPickup = o.delivery_method === 'pickup';
  const pickupLoc = o.pickup_location || defaultPickupAddress;
  
  const deliveryBlock = isPickup
    ? [
        `Delivery method: pickup`,
        `Pickup date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Pickup location: ${pickupLoc}`,
      ]
    : [
        `Delivery method: delivery`,
        `Delivery date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Area: ${o.area || 'Not specified'}`,
        `Address: ${o.address || 'Not specified'}`,
      ];

  // 4. Format Totals
  const fee = o.delivery_fee || 0;
  const itemsSubtotal = o.subtotal - fee; // Calculate subtotal without delivery fee

  // 5. Build Tracking Link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.vercel.app';
  const formattedUrl = (siteUrl.startsWith('http') ? siteUrl : `https://${siteUrl}`).replace(/\/$/, '');
  const trackingLink = `${formattedUrl}/track/${o.reference}`;

  // 6. Combine Everything
  return [
    `Order Reference: ${o.reference}`,
    ``,
    `Name: ${o.customer_name}`,
    `Phone: ${o.phone}`,
    `WhatsApp: ${o.whatsapp}`,
    ``,
    `ORDER ITEMS`,
    itemBlocks,
    upsellBlock,
    ``,
    ...deliveryBlock,
    `Special instructions: ${o.special_instructions?.trim() || 'None'}`,
    o.cake_message ? `Cake Message: "${o.cake_message}"` : '', // 👈 Global Cake Message
    ``,
    `Subtotal: ${PKR(itemsSubtotal)}`,
    `Delivery fee: ${fee > 0 ? PKR(fee) : 'Free (Pickup)'}`,
    `Total: ${PKR(o.subtotal)}`,
    ``,
    `🔗 Track your order status here:`,
    trackingLink,
  ].filter(line => line !== '').join('\n'); 
  // .filter removes any empty strings (like the optional cake message line if empty)
}

export function generateReference() {
  return 'CBA-' + Math.floor(1000000 + Math.random() * 9000000);
}

export function whatsappUrl(message: string, phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801519409555') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}