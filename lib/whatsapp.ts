export function buildOrderMessage(o: OrderPayload, pickupAddress: string): string {
  // ... existing items mapping ...

  const isPickup = o.delivery_method === 'pickup';
  
  const deliveryBlock = isPickup
    ? [
        `Delivery method: pickup`,
        `Pickup date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Pickup location: ${o.pickup_location || pickupAddress}`,
      ]
    : [
        `Delivery method: delivery`,
        `Delivery date: ${o.delivery_date}`,
        `Preferred time: ${o.preferred_time}`,
        `Area: ${o.area || 'Not specified'}`,
        `Address: ${o.address || 'Not specified'}`,
      ];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.vercel.app';
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
    o.cake_message ? `Cake Message: "${o.cake_message}"` : '', // 👈 New
    ``,
    `Subtotal: ${PKR(o.subtotal - (o.delivery_fee || 0))}`, // Subtotal without delivery
    `Delivery Fee: ${o.delivery_fee ? PKR(o.delivery_fee) : 'Free'}`,
    `Total: ${PKR(o.subtotal)}`,
    ``,
    `🔗 Track your order status here:`,
    trackingLink,
  ].join('\n');
}