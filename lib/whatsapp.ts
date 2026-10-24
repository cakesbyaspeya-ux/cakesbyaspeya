export type OrderItemPayload = {
  product_name: string;
  design_label?: string | null; 
  flavour?: string | null;
  size_label?: string | null;
  cake_message?: string | null;
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
  special_instructions?: string | null;
  subtotal: number;
  items: OrderItemPayload[];
};

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function buildOrderMessage(o: OrderPayload, pickupAddress: string): string {
  const itemBlocks = o.items.map((it, i) => {
    const lines = [`${i + 1}. ${it.product_name} x${it.qty}`];
    if (it.design_label) lines.push(`   Design: ${it.design_label}`);
    if (it.flavour) lines.push(`   Flavour: ${it.flavour}`);
    if (it.size_label) lines.push(`   Size/weight: ${it.size_label}`);
    if (it.cake_message?.trim()) lines.push(`   Cake message: ${it.cake_message.trim()}`);
    return lines.join('\n');
  }).join('\n');

  const isPickup = o.delivery_method === 'pickup';
  
  const deliveryBlock = isPickup
    ? [
        `Delivery method: pickup`,
        `Pickup date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Pickup location: ${pickupAddress}`,
      ]
    : [
        `Delivery method: delivery`,
        `Delivery date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Area: ${o.area || 'Not specified'}`,
        `Address: ${o.address || 'Not specified'}`,
      ];

  // Generate the live tracking link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.com';
  const trackingLink = `${siteUrl}/track/${o.reference}`;

  return [
    `Order Reference: ${o.reference}`,
    ``,
    `Name: ${o.customer_name}`,
    `Phone: ${o.phone}`,
    `WhatsApp: ${o.whatsapp}`,
    ``,
    `ORDER ITEMS`,
    itemBlocks,
    ``,
    ...deliveryBlock,
    `Special instructions: ${o.special_instructions?.trim() || 'None'}`,
    ``,
    `Subtotal: ${PKR(o.subtotal)}`,
    `Delivery fee: To be confirmed on WhatsApp`,
    `Total (excl. delivery): ${PKR(o.subtotal)}`,
    ``,
    `🔗 Track your order status here:`,
    trackingLink,
  ].join('\n');
}

export function generateReference() {
  return 'CBA-' + Math.floor(1000000 + Math.random() * 9000000);
}

export function whatsappUrl(message: string, phone = '8801519409555') {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}