'use client';

import { useState } from 'react';
import { generateReceiptPdf } from '@/lib/generateReceiptPdf';

export function AdminDownloadReceiptButton({ order }: { order: any }) {
  const [downloading, setDownloading] = useState(false);

  function handleDownload(e: React.MouseEvent) {
    e.preventDefault(); // Prevents navigating to the order details if placed inside a link
    setDownloading(true);
    
    try {
      const doc = generateReceiptPdf(order);
      doc.save(`Receipt-${order.reference}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF.');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className="flex items-center justify-center gap-1.5 rounded-full border border-olive/30 bg-white px-4 py-2 text-xs font-medium text-olive-dark shadow-sm hover:bg-olive hover:text-cream transition disabled:opacity-50"
      title="Download Receipt PDF"
    >
      {downloading ? '...' : '⬇️ Receipt'}
    </button>
  );
}