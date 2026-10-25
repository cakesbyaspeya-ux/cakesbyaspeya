
import { jsPDF } from 'jspdf';

type ReceiptItem = {
  product_name?: string;
  qty?: number | string;
  unit_price?: number | string;
  size_label?: string;
  flavour?: string;
  design_label?: string;
  cake_message?: string;
};

type ReceiptUpsell = {
  upsell_name?: string;
  qty?: number | string;
  unit_price?: number | string;
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
  subtotal?: number | string;
  discount_amount?: number | string;
  promo_code?: string;
  delivery_charge?: number | string;
  delivery_fee?: number | string;
  total_amount?: number | string;
  payment_method?: string;
  payment_status?: string;
};

const C = {
  burgundy: [110, 31, 46] as [number, number, number],
  olive: [92, 107, 63] as [number, number, number],
  black: [20, 20, 20] as [number, number, number],
  grey: [100, 100, 100] as [number, number, number],
};

const RECEIPT_WIDTH = 80;
const MARGIN = 5;
const INNER_WIDTH = RECEIPT_WIDTH - MARGIN * 2;

const num = (value: unknown): number => {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
};

const text = (
  value: unknown,
  fallback = 'N/A'
): string => {
  if (value == null || String(value).trim() === '') {
    return fallback;
  }

  return String(value).trim();
};

const money = (value: number): string =>
  `Tk ${Math.round(value).toLocaleString('en-BD')}`;

function formatDate(value?: string): string {
  if (!value) return 'N/A';

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T12:00:00`)
    : new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(value?: string): string {
  if (!value) return '';

  // Preserve a time-only value rather than parsing it as a date.
  return value;
}

export function generateReceiptPdf(order: ReceiptOrder) {
  const items = order.order_items ?? [];
  const extras = order.order_upsells ?? [];

  // A custom-height receipt avoids an A4 page and gives the receipt
  // a narrow, thermal-printer-inspired appearance.
  const estimatedHeight =
    155 +
    items.reduce((sum, item) => {
      const details = [
        item.size_label,
        item.flavour,
        item.design_label,
        item.cake_message,
      ].filter(Boolean).length;

      return sum + 16 + details * 5;
    }, 0) +
    extras.length * 10 +
    (order.address ? 18 : 0);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [RECEIPT_WIDTH, Math.max(220, estimatedHeight)],
    compress: true,
  });

  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 10;

  const center = (value: string, atY: number) => {
    doc.text(value, RECEIPT_WIDTH / 2, atY, {
      align: 'center',
    });
  };

  const separator = () => {
    doc.setDrawColor(...C.black);
    doc.setLineWidth(0.25);
    doc.setLineDashPattern([1.1, 0.8], 0);
    doc.line(MARGIN, y, RECEIPT_WIDTH - MARGIN, y);
    doc.setLineDashPattern([], 0);
    y += 5;
  };

  const row = (
    label: string,
    value: string,
    bold = false
  ) => {
    doc.setFont('courier', bold ? 'bold' : 'normal');
    doc.setFontSize(9);

    doc.text(label, MARGIN, y);

    doc.text(value, RECEIPT_WIDTH - MARGIN, y, {
      align: 'right',
    });

    y += 6;
  };

  const wrapped = (
    value: string,
    width = INNER_WIDTH
  ): string[] => {
    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    return doc.splitTextToSize(value, width);
  };

  const addWrapped = (
    value: string,
    options?: {
      align?: 'left' | 'center';
      color?: [number, number, number];
      width?: number;
    }
  ) => {
    const lines = wrapped(value, options?.width ?? INNER_WIDTH);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...(options?.color ?? C.black));

    lines.forEach((line) => {
      if (options?.align === 'center') {
        center(line, y);
      } else {
        doc.text(line, MARGIN, y);
      }

      y += 4;
    });
  };

  // =================================================
  // 1. BRANDING
  // =================================================

  doc.setTextColor(...C.burgundy);
  doc.setFont('courier', 'bold');
  doc.setFontSize(17);

  center('CAKES BY ASPEYA', y);
  y += 8;

  doc.setTextColor(...C.black);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  center('CUSTOM CAKES & DESSERTS', y);
  y += 6;

  addWrapped(
    'Sanmar Ocean City / 2 No Gate, Women College Mor, Chittagong',
    { align: 'center' }
  );

  center('+880 1519 409555', y);
  y += 7;

  separator();

  // =================================================
  // 2. ORDER INFORMATION
  // =================================================

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  center('ORDER RECEIPT', y);
  y += 7;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  row('Receipt No.', text(order.reference));
  row('Date', formatDate(order.created_at));

  separator();

  // =================================================
  // 3. CUSTOMER INFORMATION
  // =================================================

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text('CUSTOMER DETAILS', MARGIN, y);
  y += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  addWrapped(`Name: ${text(order.customer_name)}`);
  addWrapped(`Phone: ${text(order.phone)}`);

  y += 2;
  separator();

  // =================================================
  // 4. DELIVERY INFORMATION
  // =================================================

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text('DELIVERY DETAILS', MARGIN, y);
  y += 6;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  row(
    'Method',
    order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'
  );

  addWrapped(
    `Date: ${formatDate(order.delivery_date)}`
  );

  const time = formatTime(order.preferred_time);

  if (time) {
    addWrapped(`Time: ${time}`);
  }

  if (order.delivery_method !== 'pickup') {
    if (order.area) {
      addWrapped(`Area: ${order.area}`);
    }

    if (order.address) {
      addWrapped(`Address: ${order.address}`);
    }
  }

  y += 2;
  separator();

  // =================================================
  // 5. ITEMS
  // =================================================

  doc.setFont('courier', 'bold');
  doc.setFontSize(9);
  doc.text('ORDER ITEMS', MARGIN, y);
  y += 6;

  const drawItem = (
    name: string,
    qty: number,
    unitPrice: number,
    details: string[] = [],
    cakeMessage?: string
  ) => {
    const itemTotal = qty * unitPrice;

    // Split long names so they do not overlap the price.
    const nameLines = doc.splitTextToSize(
      name,
      INNER_WIDTH - 20
    );

    doc.setFont('courier', 'bold');
    doc.setFontSize(8);

    nameLines.forEach((line: string, index: number) => {
      doc.text(line, MARGIN, y + index * 4);
    });

    doc.text(money(itemTotal), RECEIPT_WIDTH - MARGIN, y, {
      align: 'right',
    });

    y += Math.max(5, nameLines.length * 4);

    doc.setFont('courier', 'normal');
    doc.setFontSize(8);

    details.filter(Boolean).forEach((detail) => {
      addWrapped(`  ${detail}`);
    });

    if (cakeMessage) {
      addWrapped(`  Message: ${cakeMessage}`, {
        color: C.burgundy,
      });
    }

    y += 2;
  };

  items.forEach((item) => {
    const details = [
      item.size_label ? `Size: ${item.size_label}` : '',
      item.flavour ? `Flavour: ${item.flavour}` : '',
      item.design_label ? `Design: ${item.design_label}` : '',
    ].filter(Boolean);

    drawItem(
      `${text(item.product_name, 'Cake')} x${num(item.qty)}`,
      num(item.qty),
      num(item.unit_price),
      details,
      item.cake_message
    );
  });

  extras.forEach((item) => {
    drawItem(
      `${text(item.upsell_name, 'Extra')} x${num(item.qty)}`,
      num(item.qty),
      num(item.unit_price)
    );
  });

  separator();

  // =================================================
  // 6. PAYMENT SUMMARY
  // =================================================

  const discount = Math.max(
    0,
    num(order.discount_amount)
  );

  const deliveryFee = Math.max(
    0,
    num(order.delivery_charge ?? order.delivery_fee)
  );

  // Assumes subtotal is after discount and before delivery.
  const amountAfterDiscount = num(order.subtotal);
  const subtotalBeforeDiscount =
    amountAfterDiscount + discount;

  const calculatedTotal =
    amountAfterDiscount + deliveryFee;

  const total =
    order.total_amount != null &&
    String(order.total_amount).trim() !== '' &&
    Number.isFinite(Number(order.total_amount))
      ? Number(order.total_amount)
      : calculatedTotal;

  row('Subtotal', money(subtotalBeforeDiscount));

  if (discount > 0) {
    row(
      `Discount (${text(order.promo_code, 'Promo')})`,
      `-${money(discount)}`
    );
  }

  if (deliveryFee > 0) {
    row('Delivery', money(deliveryFee));
  }

  separator();

  doc.setFont('courier', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...C.burgundy);

  doc.text('TOTAL', MARGIN, y);

  doc.text(money(total), RECEIPT_WIDTH - MARGIN, y, {
    align: 'right',
  });

  y += 8;

  doc.setTextColor(...C.black);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);

  if (order.payment_method) {
    row('Payment', text(order.payment_method));
  }

  if (order.payment_status) {
    row('Status', text(order.payment_status));
  }

  separator();

  // =================================================
  // 7. DECORATIVE BARCODE
  // =================================================

  // This barcode-like graphic is decorative and is not
  // guaranteed to be scannable or encode the receipt number.
  const reference = text(order.reference, 'ASPEYA');

  let seed = 0;

  for (let i = 0; i < reference.length; i++) {
    seed = (seed * 31 + reference.charCodeAt(i)) >>> 0;
  }

  let barX = MARGIN;
  const barcodeY = y;
  const barcodeHeight = 13;
  const barcodeWidth = INNER_WIDTH;

  doc.setFillColor(...C.black);

  // Start/end markers
  doc.rect(barX, barcodeY, 0.8, barcodeHeight, 'F');
  barX += 1.5;

  while (barX < MARGIN + barcodeWidth - 2) {
    seed = (seed * 1664525 + 1013904223) >>> 0;

    const bar = 0.35 + (seed % 3) * 0.25;
    const gap = 0.3 + ((seed >>> 5) % 3) * 0.2;

    doc.rect(barX, barcodeY, bar, barcodeHeight, 'F');
    barX += bar + gap;
  }

  doc.rect(
    MARGIN + barcodeWidth - 1,
    barcodeY,
    0.8,
    barcodeHeight,
    'F'
  );

  y += barcodeHeight + 5;

  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...C.black);

  center(reference, y);
  y += 8;

// =================================================
// 8. THANK-YOU MESSAGE
// =================================================

doc.setFont('courier', 'bold');
doc.setFontSize(9);
doc.setTextColor(...C.burgundy);

center('Thank you for your order!', y);

// Minimal bottom padding
y += 3;

return doc;
}
