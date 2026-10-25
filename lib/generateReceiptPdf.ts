import { jsPDF } from 'jspdf';

const PKR = (n: number) => n.toLocaleString('en-BD', { minimumFractionDigits: 2 });

export function generateReceiptPdf(order: any) {
  // Use A4 format, but we'll format it to look like a narrow receipt
  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm'
  });

  // --- Setup Fonts ---
  doc.setFont('courier', 'bold');
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const centerX = pageWidth / 2;
  let yPos = 20;

  // --- Header ---
  doc.setFontSize(18);
  doc.text('CAKES BY ASPEYA', centerX, yPos, { align: 'center' });
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text('Sanmar Ocean City / 2 No Gate', centerX, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text('Women College Mor, Chittagong', centerX, yPos, { align: 'center' });
  
  yPos += 5;
  doc.text('+880 1519 409555', centerX, yPos, { align: 'center' });

  // --- Date & Ref ---
  yPos += 10;
  const dateStr = new Date(order.created_at).toLocaleDateString('en-GB');
  doc.text(`Date: ${dateStr} | Ref: ${order.reference}`, centerX, yPos, { align: 'center' });

  // --- Divider ---
  yPos += 5;
  doc.text('-'.repeat(72), 20, yPos);

  // --- Customer Info ---
  yPos += 6;
  doc.text(`Customer: ${order.customer_name}`, 20, yPos);
  doc.text(`Phone: ${order.phone}`, 120, yPos);

  yPos += 5;
  if (order.delivery_method === 'delivery') {
    doc.text(`Deliver: ${order.delivery_date} | ${order.preferred_time}`, 20, yPos);
    yPos += 5;
    doc.text(`Address: ${order.area} - ${order.address}`, 20, yPos);
  } else {
    doc.text(`Pickup: ${order.delivery_date} | ${order.preferred_time}`, 20, yPos);
  }

  // --- Item Header ---
  yPos += 6;
  doc.text('-'.repeat(72), 20, yPos);
  yPos += 6;
  doc.setFont('courier', 'bold');
  doc.text('QTY  ITEM', 20, yPos);
  doc.text('PRICE', 190, yPos, { align: 'right' });
  
  yPos += 3;
  doc.text('-'.repeat(72), 20, yPos);
  
  // --- Items Loop ---
  yPos += 6;
  doc.setFont('courier', 'normal');

  (order.order_items || []).forEach((item: any) => {
    // Split long names so they wrap nicely
    const itemNameLines = doc.splitTextToSize(item.product_name, 120);
    
    // Print Qty and Item Name
    doc.text(`${item.qty.toString().padEnd(3)}  ${itemNameLines[0]}`, 20, yPos);
    
    // Print Price (right aligned)
    const price = item.unit_price * item.qty;
    doc.text(`৳${PKR(price)}`, 190, yPos, { align: 'right' });
    
    // Print remaining name lines if wrapped
    if (itemNameLines.length > 1) {
      for (let i = 1; i < itemNameLines.length; i++) {
        yPos += 5;
        doc.text(`     ${itemNameLines[i]}`, 20, yPos);
      }
    }

    // Print Size, Flavour, Design
    const details = [item.size_label, item.flavour, item.design_label].filter(Boolean).join(' | ');
    if (details) {
      yPos += 5;
      doc.setFontSize(9);
      doc.text(`     ${details}`, 20, yPos);
      doc.setFontSize(10);
    }

    // Print Cake Message
    if (item.cake_message) {
      yPos += 5;
      doc.setFont('courier', 'bold');
      const msgLines = doc.splitTextToSize(`Msg: "${item.cake_message}"`, 150);
      msgLines.forEach((line: string) => {
        doc.text(`     ${line}`, 20, yPos);
        yPos += 5;
      });
      doc.setFont('courier', 'normal');
      yPos -= 5; // adjust for loop increment
    }
    
    yPos += 8; // spacing between items
  });

  // --- Extras / Upsells ---
  if (order.order_upsells && order.order_upsells.length > 0) {
    order.order_upsells.forEach((u: any) => {
      doc.text(`${u.qty.toString().padEnd(3)}  + Extra: ${u.upsell_name}`, 20, yPos);
      const price = u.unit_price * u.qty;
      doc.text(`৳${PKR(price)}`, 190, yPos, { align: 'right' });
      yPos += 6;
    });
  }

  // --- Totals Section ---
  yPos += 2;
  doc.text('-'.repeat(72), 20, yPos);
  yPos += 6;
  
  // Subtotal (Calculate original total before discount)
  const discount = Number(order.discount_amount) || 0;
  const finalTotal = Number(order.subtotal);
  const subTotal = finalTotal + discount;

  doc.text('Subtotal:', 150, yPos);
  doc.text(`৳${PKR(subTotal)}`, 190, yPos, { align: 'right' });
  yPos += 6;

  if (discount > 0) {
    doc.text(`Discount (${order.promo_code || 'Applied'}):`, 150, yPos);
    doc.text(`-৳${PKR(discount)}`, 190, yPos, { align: 'right' });
    yPos += 6;
  }

  doc.setFont('courier', 'bold');
  doc.setFontSize(12);
  doc.text('TOTAL:', 150, yPos);
  doc.text(`৳${PKR(finalTotal)}`, 190, yPos, { align: 'right' });

  yPos += 6;
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.text('-'.repeat(72), 20, yPos);

  // --- Fake Barcode ---
  yPos += 10;
  doc.setFont('courier', 'normal');
  doc.setFontSize(28);
  // A visual trick to create a barcode-like look using pipes
  doc.text('|||| ||| ||||| || |||| ||| |||||', centerX, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setFontSize(8);
  doc.text(order.reference, centerX, yPos, { align: 'center' });

  // --- Footer ---
  yPos += 12;
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.text('Thank you for choosing Cakes by Aspeya!', centerX, yPos, { align: 'center' });
  
  yPos += 5;
  doc.setFont('courier', 'normal');
  doc.text('We appreciate your business.', centerX, yPos, { align: 'center' });

  return doc;
}