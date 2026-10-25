import { jsPDF } from 'jspdf';

const PKR = (n: number) => n.toLocaleString('en-BD');

export function generateReceiptPdf(order: any) {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const rightEdge = pageWidth - margin;

  // ═══════════════════════════════════════════
  // 1. HEADER (Burgundy Background)
  // ═══════════════════════════════════════════
  doc.setFillColor(110, 31, 46); // Burgundy (#6E1F2E)
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255); // White text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('CAKES BY ASPEYA', pageWidth / 2, 18, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Sanmar Ocean City / 2 No Gate · Women College Mor, Chittagong', pageWidth / 2, 26, { align: 'center' });
  doc.text('+880 1519 409555', pageWidth / 2, 32, { align: 'center' });

  // ═══════════════════════════════════════════
  // 2. ORDER & CUSTOMER INFO
  // ═══════════════════════════════════════════
  doc.setTextColor(42, 42, 36); // Dark Ink (#2A2A24)
  let y = 55;

  // Left Column (Customer)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Billed To:', margin, y);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(order.customer_name, margin, y + 6);
  doc.text(order.phone, margin, y + 12);

  // Right Column (Order Details)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Receipt Details:', rightEdge, y, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const dateStr = new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  doc.text(`Ref: ${order.reference}`, rightEdge, y + 6, { align: 'right' });
  doc.text(`Date: ${dateStr}`, rightEdge, y + 12, { align: 'right' });

  // ═══════════════════════════════════════════
  // 3. DELIVERY INFO
  // ═══════════════════════════════════════════
  y += 28;
  doc.setFillColor(250, 243, 227); // Cream background
  doc.rect(margin, y, pageWidth - (margin * 2), 20, 'F');

  doc.setFont('helvetica', 'bold');
  doc.text('Delivery Method:', margin + 5, y + 7);
  doc.setFont('helvetica', 'normal');
  doc.text(order.delivery_method === 'pickup' ? 'Store Pickup' : 'Home Delivery', margin + 35, y + 7);

  doc.setFont('helvetica', 'bold');
  doc.text('Scheduled:', margin + 5, y + 15);
  doc.setFont('helvetica', 'normal');
  doc.text(`${order.delivery_date} at ${order.preferred_time}`, margin + 35, y + 15);

  if (order.delivery_method === 'delivery') {
    doc.setFont('helvetica', 'bold');
    doc.text('Address:', rightEdge - 80, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.text(`${order.area}`, rightEdge - 60, y + 7);
    // Split address if too long
    const splitAddr = doc.splitTextToSize(order.address, 50);
    doc.text(splitAddr, rightEdge - 60, y + 15);
  }

  // ═══════════════════════════════════════════
  // 4. ITEMS TABLE
  // ═══════════════════════════════════════════
  y += 32;
  
  // Table Header
  doc.setFillColor(92, 107, 63); // Olive Green (#5C6B3F)
  doc.rect(margin, y, pageWidth - (margin * 2), 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  
  doc.text('QTY', margin + 3, y + 5.5);
  doc.text('ITEM DESCRIPTION', margin + 18, y + 5.5);
  doc.text('PRICE', rightEdge - 3, y + 5.5, { align: 'right' });

  y += 12;
  doc.setTextColor(42, 42, 36);

  // Table Rows
  (order.order_items || []).forEach((item: any) => {
    const itemTotal = item.unit_price * item.qty;
    
    // Qty & Name
    doc.setFont('helvetica', 'bold');
    doc.text(`${item.qty}`, margin + 3, y);
    
    const splitName = doc.splitTextToSize(item.product_name, 100);
    doc.text(splitName, margin + 18, y);
    
    // Price
    doc.text(`৳${PKR(itemTotal)}`, rightEdge - 3, y, { align: 'right' });
    y += 5;

    // Details (Size, Flavour, Design)
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100); // Grey
    const details = [item.size_label, item.flavour, item.design_label].filter(Boolean).join(' · ');
    if (details) {
      doc.text(details, margin + 18, y);
      y += 4.5;
    }

    // Cake Message (Highlighted)
    if (item.cake_message) {
      doc.setTextColor(110, 31, 46); // Burgundy
      doc.setFont('helvetica', 'italic');
      doc.text(`Message: "${item.cake_message}"`, margin + 18, y);
      y += 4.5;
      doc.setFont('helvetica', 'normal');
    }

    // Upsells
    doc.setTextColor(42, 42, 36);
    doc.setFontSize(10);
    
    // Divider line
    y += 2;
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, y, rightEdge, y);
    y += 7;
  });

  // Upsells (Extras)
  if (order.order_upsells && order.order_upsells.length > 0) {
    order.order_upsells.forEach((u: any) => {
      doc.setFont('helvetica', 'normal');
      doc.text(`${u.qty}`, margin + 3, y);
      doc.text(`✨ Extra: ${u.upsell_name}`, margin + 18, y);
      doc.text(`৳${PKR(u.unit_price * u.qty)}`, rightEdge - 3, y, { align: 'right' });
      y += 6;
    });
    y += 2;
    doc.line(margin, y, rightEdge, y);
    y += 7;
  }

  // ═══════════════════════════════════════════
  // 5. TOTALS
  // ═══════════════════════════════════════════
  const discount = Number(order.discount_amount) || 0;
  const finalTotal = Number(order.subtotal);
  const subTotal = finalTotal + discount;

  // Right align totals block
  const totalX = rightEdge - 50;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Subtotal:', totalX, y);
  doc.text(`৳${PKR(subTotal)}`, rightEdge - 3, y, { align: 'right' });
  y += 6;

  if (discount > 0) {
    doc.setTextColor(110, 31, 46);
    doc.text(`Discount (${order.promo_code || 'Promo'}):`, totalX, y);
    doc.text(`-৳${PKR(discount)}`, rightEdge - 3, y, { align: 'right' });
    y += 6;
  }

  // Final Total
  doc.setTextColor(42, 42, 36);
  doc.setDrawColor(92, 107, 63); // Olive line above total
  doc.setLineWidth(0.5);
  doc.line(totalX, y - 2, rightEdge, y - 2);
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL:', totalX, y + 6);
  doc.text(`৳${PKR(finalTotal)}`, rightEdge - 3, y + 6, { align: 'right' });

  // ═══════════════════════════════════════════
  // 6. FOOTER (Thank You)
  // ═══════════════════════════════════════════
  y = 260; // Push to bottom of A4
  
  doc.setDrawColor(230, 230, 230);
  doc.line(margin, y, rightEdge, y);
  
  y += 15;
  doc.setTextColor(110, 31, 46); // Burgundy
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('Thank you for choosing us!', pageWidth / 2, y, { align: 'center' });

  y += 7;
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('If you have any questions about this receipt, please contact us on WhatsApp.', pageWidth / 2, y, { align: 'center' });

  return doc;
}