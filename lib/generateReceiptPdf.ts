import { jsPDF } from 'jspdf';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function generateReceiptPdf(order: any) {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Cakes by Aspeya', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sanmar Ocean City / 2 No Gate', 105, 28, { align: 'center' });
  doc.text('Women College Mor, Chittagong', 105, 33, { align: 'center' });
  doc.text('+880 1519 409555', 105, 38, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);

  // Order Info
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RECEIPT', 20, 55);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order Ref: ${order.reference}`, 20, 65);
  doc.text(`Date: ${new Date(order.created_at).toLocaleDateString('en-GB')}`, 20, 70);
  
  doc.text(`Customer: ${order.customer_name}`, 120, 65);
  doc.text(`Phone: ${order.phone}`, 120, 70);

  // Delivery Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Details:', 20, 85);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${order.delivery_date} at ${order.preferred_time}`, 20, 92);
  if (order.delivery_method === 'delivery') {
    doc.text(`Area: ${order.area}`, 20, 97);
    doc.text(`Address: ${order.address}`, 20, 102);
  } else {
    doc.text('Method: Store Pickup', 20, 97);
  }

  // Items Table
  let yPos = 115;
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, yPos);
  doc.text('Qty', 120, yPos);
  doc.text('Price', 160, yPos);
  
  doc.line(20, yPos + 2, 190, yPos + 2);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  (order.order_items || []).forEach((item: any) => {
    doc.text(item.product_name, 20, yPos);
    doc.text(`${item.qty}`, 120, yPos);
    doc.text(PKR(item.unit_price * item.qty), 160, yPos);
    
    let detailY = yPos + 5;
    doc.setFontSize(9);
    const details = [item.size_label, item.flavour, item.design_label].filter(Boolean).join(' · ');
    if (details) doc.text(details, 25, detailY);
    
    if (item.cake_message) {
      doc.setFont('helvetica', 'bold');
      doc.text(`Message: "${item.cake_message}"`, 25, detailY + 5);
      doc.setFont('helvetica', 'normal');
    }
    doc.setFontSize(10);
    yPos += 20;
  });

  // Extras
  if (order.order_upsells && order.order_upsells.length > 0) {
    order.order_upsells.forEach((u: any) => {
      doc.text(`Extra: ${u.upsell_name}`, 20, yPos);
      doc.text(`${u.qty}`, 120, yPos);
      doc.text(PKR(u.unit_price * u.qty), 160, yPos);
      yPos += 10;
    });
  }

  // Totals
  doc.line(20, yPos, 190, yPos);
  yPos += 10;
  
  if (order.discount_amount > 0) {
    doc.text(`Discount (${order.promo_code}): -${PKR(order.discount_amount)}`, 20, yPos);
    yPos += 7;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 20, yPos);
  doc.text(PKR(order.subtotal), 160, yPos);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for choosing Cakes by Aspeya!', 105, 280, { align: 'center' });

  return doc;
}