
import { jsPDF } from 'jspdf';

type ReceiptItem = {
  product_name?: string;
  qty?: number;
  unit_price?: number;
  size_label?: string;
  flavour?: string;
  design_label?: string;
  cake_message?: string;
};

type ReceiptUpsell = {
  upsell_name?: string;
  qty?: number;
  unit_price?: number;
};

type ReceiptOrder = {
  customer_name?: string;
  phone?: string;
  reference?: string;
  created_at?: string;
  delivery_method?: string;
  delivery_date?: string;
  preferred_time?: string;
  area?: string;
  address?: string;
  order_items?: ReceiptItem[];
  order_upsells?: ReceiptUpsell[];
  discount_amount?: number | string;
  promo_code?: string;
  subtotal?: number | string;
  delivery_charge?: number | string;
  delivery_fee?: number | string;
  total_amount?: number | string;
};

const COLORS = {
  burgundy: [110, 31, 46] as [number, number, number],
  burgundyLight: [248, 239, 241] as [number, number, number],
  olive: [92, 107, 63] as [number, number, number],
  cream: [250, 246, 237] as [number, number, number],
  ink: [42, 42, 36] as [number, number, number],
  muted: [112, 112, 105] as [number, number, number],
  border: [231, 228, 220] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

const money = (value: number) =>
  `Tk ${Math.round(value).toLocaleString('en-BD')}`;

const numberOrZero = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

const textOr = (value: unknown, fallback = 'Not provided') =>
  value == null || String(value).trim() === ''
    ? fallback
    : String(value).trim();

const dateLabel = (value?: string) => {
  if (!value) return 'Not provided';

  // Avoid timezone shifts for date-only values such as YYYY-MM-DD.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export function generateReceiptPdf(order: ReceiptOrder) {
  const doc = new jsPDF({
    format: 'a4',
    unit: 'mm',
    orientation: 'portrait',
    compress: true,
  });

  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const R = W - M;
  const CONTENT_W = W - M * 2;
  const BOTTOM = H - 19;

  let y = 0;

  const setText = (
    color: [number, number, number] = COLORS.ink
  ) => doc.setTextColor(...color);

  const line = (atY: number) => {
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.25);
    doc.line(M, atY, R, atY);
  };

  const write = (
    value: unknown,
    x: number,
    atY: number,
    maxWidth: number,
    options: { font?: string; size?: number; color?: [number, number, number] } = {}
  ) => {
    const content = String(value ?? '');
    doc.setFont('helvetica', options.font ?? 'normal');
    doc.setFontSize(options.size ?? 9);
    setText(options.color ?? COLORS.ink);

    const wrapped = doc.splitTextToSize(content, maxWidth);
    doc.text(wrapped, x, atY);

    return wrapped.length * (options.size ?? 9) * 0.42;
  };

  const ensureSpace = (height: number) => {
    if (y + height <= BOTTOM) return;

    doc.addPage();
    drawPageHeader();
    y = 48;
  };

  function drawPageHeader() {
    doc.setFillColor(...COLORS.burgundy);
    doc.rect(0, 0, W, 13, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setText(COLORS.white);
    doc.text('CAKES BY ASPEYA', M, 8.2);

    doc.setFont('helvetica', 'normal');
    doc.text('ORDER RECEIPT', R, 8.2, { align: 'right' });
  }

  function drawFooter(page: number, totalPages: number) {
    doc.setDrawColor(...COLORS.border);
    doc.line(M, H - 15, R, H - 15);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    setText(COLORS.muted);

    doc.text('Thank you for choosing Cakes by Aspeya!', M, H - 9);
    doc.text(
      `Page ${page} of ${totalPages}`,
      R,
      H - 9,
      { align: 'right' }
    );
  }

  function sectionTitle(title: string) {
    ensureSpace(12);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    setText(COLORS.burgundy);
    doc.text(title.toUpperCase(), M, y);

    y += 4;
    line(y);
    y += 7;
  }

  // --------------------------------------------------
  // 1. PREMIUM BRAND HEADER
  // --------------------------------------------------

  doc.setFillColor(...COLORS.burgundy);
  doc.rect(0, 0, W, 45, 'F');

  doc.setFillColor(...COLORS.olive);
  doc.rect(0, 43, W, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(23);
  setText(COLORS.white);
  doc.text('CAKES BY ASPEYA', W / 2, 17, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Handcrafted with love, made for your moments', W / 2, 24, {
    align: 'center',
  });

  doc.setFontSize(8);
  doc.text(
    'Sanmar Ocean City / 2 No Gate, Women College Mor, Chittagong',
    W / 2,
    32,
    { align: 'center' }
  );
  doc.text('+880 1519 409555', W / 2, 38, { align: 'center' });

  // Receipt reference panel
  y = 54;

  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(M, y, CONTENT_W, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  setText(COLORS.burgundy);
  doc.text('ORDER RECEIPT', M + 5, y + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(COLORS.muted);
  doc.text(
    `Reference: ${textOr(order.reference, 'N/A')}`,
    M + 5,
    y + 13
  );

  doc.text(
    `Issued: ${dateLabel(order.created_at)}`,
    R - 5,
    y + 10,
    { align: 'right' }
  );

  y += 29;

  // --------------------------------------------------
  // 2. CUSTOMER INFORMATION
  // --------------------------------------------------

  sectionTitle('Customer information');

  const colGap = 10;
  const colW = (CONTENT_W - colGap) / 2;
  const leftX = M;
  const rightX = M + colW + colGap;

  doc.setFillColor(...COLORS.white);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(leftX, y - 2, colW, 23, 2, 2, 'FD');
  doc.roundedRect(rightX, y - 2, colW, 23, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  setText(COLORS.muted);
  doc.text('BILLED TO', leftX + 4, y + 4);
  doc.text('DELIVERY DETAILS', rightX + 4, y + 4);

  write(textOr(order.customer_name), leftX + 4, y + 10, colW - 8, {
    font: 'bold',
    size: 9,
  });

  write(textOr(order.phone), leftX + 4, y + 16, colW - 8, {
    size: 8,
    color: COLORS.muted,
  });

  write(
    order.delivery_method === 'pickup' ? 'Store pickup' : 'Home delivery',
    rightX + 4,
    y + 10,
    colW - 8,
    { font: 'bold', size: 9 }
  );

  write(
    `${dateLabel(order.delivery_date)} · ${textOr(order.preferred_time, 'Time not set')}`,
    rightX + 4,
    y + 16,
    colW - 8,
    { size: 8, color: COLORS.muted }
  );

  y += 31;

  if (order.delivery_method !== 'pickup') {
    sectionTitle('Delivery address');

    const addressText = [
      order.area,
      order.address,
    ]
      .filter((v) => v != null && String(v).trim() !== '')
      .join(', ');

    const addressLines = doc.splitTextToSize(
      textOr(addressText),
      CONTENT_W - 10
    );

    const addressHeight = Math.max(15, addressLines.length * 4 + 8);
    ensureSpace(addressHeight + 3);

    doc.setFillColor(...COLORS.cream);
    doc.roundedRect(M, y - 3, CONTENT_W, addressHeight, 2, 2, 'F');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    setText(COLORS.ink);
    doc.text(addressLines, M + 5, y + 2);

    y += addressHeight + 5;
  }

  // --------------------------------------------------
  // 3. ITEMS TABLE
  // --------------------------------------------------

  sectionTitle('Order summary');

  const qtyX = M + 4;
  const itemX = M + 18;
  const priceX = R - 4;
  const descriptionW = priceX - itemX - 24;

  function drawTableHeader() {
    doc.setFillColor(...COLORS.olive);
    doc.roundedRect(M, y - 4, CONTENT_W, 10, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    setText(COLORS.white);

    doc.text('QTY', qtyX, y + 2);
    doc.text('ITEM DESCRIPTION', itemX, y + 2);
    doc.text('AMOUNT', priceX, y + 2, { align: 'right' });

    y += 12;
  }

  drawTableHeader();

  const drawItem = (
    name: string,
    qty: number,
    unitPrice: number,
    details: string[] = [],
    message?: string
  ) => {
    const safeQty = Number.isFinite(qty) ? qty : 0;
    const amount = unitPrice * safeQty;
    const nameLines = doc.splitTextToSize(name, descriptionW);
    const detailText = details.filter(Boolean).join(' · ');
    const detailLines = detailText
      ? doc.splitTextToSize(detailText, descriptionW)
      : [];
    const messageLines = message
      ? doc.splitTextToSize(`Cake message: "${message}"`, descriptionW)
      : [];

    const rowHeight =
      Math.max(5, nameLines.length * 4.5) +
      (detailLines.length ? detailLines.length * 4 + 1 : 0) +
      (messageLines.length ? messageLines.length * 4 + 1 : 0) +
      7;

    ensureSpace(rowHeight + 2);

    // Redraw the header after a page break.
    // The first-page header is already present, so this is only
    // needed when ensureSpace created a new page.
    // A compact row layout keeps the receipt easy to scan.

    const startY = y;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    setText(COLORS.ink);
    doc.text(String(safeQty), qtyX, startY);

    doc.text(nameLines, itemX, startY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.text(money(amount), priceX, startY, { align: 'right' });

    let detailY = startY + Math.max(5, nameLines.length * 4.5);

    if (detailLines.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      setText(COLORS.muted);
      doc.text(detailLines, itemX, detailY);
      detailY += detailLines.length * 4 + 1;
    }

    if (messageLines.length) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7.5);
      setText(COLORS.burgundy);
      doc.text(messageLines, itemX, detailY);
      detailY += messageLines.length * 4 + 1;
    }

    y = Math.max(startY + rowHeight - 3, detailY + 2);
    line(y);
    y += 6;
  };

  (order.order_items ?? []).forEach((item) => {
    drawItem(
      textOr(item.product_name, 'Cake'),
      numberOrZero(item.qty),
      numberOrZero(item.unit_price),
      [item.size_label, item.flavour, item.design_label].filter(
        (v): v is string => Boolean(v)
      ),
      item.cake_message
    );
  });

  (order.order_upsells ?? []).forEach((item) => {
    drawItem(
      `Extra: ${textOr(item.upsell_name, 'Additional item')}`,
      numberOrZero(item.qty),
      numberOrZero(item.unit_price)
    );
  });

  // --------------------------------------------------
  // 4. PAYMENT SUMMARY
  // --------------------------------------------------

  const discount = Math.max(0, numberOrZero(order.discount_amount));
  const deliveryFee = Math.max(
    0,
    numberOrZero(order.delivery_charge ?? order.delivery_fee)
  );

  // Compatibility with the original code:
  // order.subtotal is treated as the amount after discount,
  // but before delivery charges.
  const amountAfterDiscount = numberOrZero(order.subtotal);
  const subtotalBeforeDiscount = amountAfterDiscount + discount;
  const total = numberOrZero(order.total_amount) ||
    amountAfterDiscount + deliveryFee;

  ensureSpace(43);

  y += 2;
  const summaryW = 88;
  const summaryX = R - summaryW;

  doc.setFillColor(...COLORS.cream);
  doc.roundedRect(summaryX, y, summaryW, discount > 0 ? 39 : 33, 2, 2, 'F');

  const labelX = summaryX + 5;
  const valueX = R - 5;
  let sy = y + 8;

  const summaryRow = (label: string, value: string, color = COLORS.ink) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    setText(color);
    doc.text(label, labelX, sy);
    doc.text(value, valueX, sy, { align: 'right' });
    sy += 6;
  };

  summaryRow('Subtotal', money(subtotalBeforeDiscount));

  if (discount > 0) {
    summaryRow(
      `Discount (${textOr(order.promo_code, 'Promo')})`,
      `-${money(discount)}`,
      COLORS.burgundy
    );
  }

  if (deliveryFee > 0) {
    summaryRow('Delivery charge', money(deliveryFee));
  }

  doc.setDrawColor(...COLORS.olive);
  doc.setLineWidth(0.4);
  doc.line(labelX, sy - 2, valueX, sy - 2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(COLORS.burgundy);
  doc.text('TOTAL', labelX, sy + 4);
  doc.text(money(total), valueX, sy + 4, { align: 'right' });

  y += discount > 0 ? 45 : 39;

  // --------------------------------------------------
  // 5. THANK-YOU PANEL
  // --------------------------------------------------

  ensureSpace(25);

  y += 4;
  doc.setFillColor(...COLORS.burgundyLight);
  doc.roundedRect(M, y, CONTENT_W, 20, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  setText(COLORS.burgundy);
  doc.text('Thank you for choosing us!', W / 2, y + 8, {
    align: 'center',
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  setText(COLORS.muted);
  doc.text('Questions? Contact us on WhatsApp: +880 1519 409555', W / 2, y + 14, {
    align: 'center',
  });

  // --------------------------------------------------
  // 6. FOOTERS ON EVERY PAGE
  // --------------------------------------------------

  const pageCount = doc.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);
    drawFooter(page, pageCount);
  }

  return doc;
}
