'use client';

import { useState } from 'react';
import Link from 'next/link';
import { generateReceiptPdf } from '@/lib/generateReceiptPdf';

export function OrderSuccessClient({ order }: { order: any }) {
  const [downloading, setDownloading] = useState(false);

  // 1. Generate and Download PDF
  function handleDownload() {
    setDownloading(true);
    try {
      const doc = generateReceiptPdf(order);
      doc.save(`Receipt-${order.reference}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert('Failed to download PDF. Please check the console.');
    } finally {
      setDownloading(false);
    }
  }

  // 2. Custom WhatsApp Message (Telling you they are sending the PDF)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801519409555';
  const waMessage = `Hi Cakes by Aspeya! I would like to confirm my order *${order.reference}*.
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-cream-card p-8 md:p-12 ring-1 ring-black/5 text-center shadow-soft">
        
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive/15 text-4xl mb-6">
          ✓
        </div>
        
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">Order Received!</h1>
        <p className="text-olive-dark mb-8">
          Your reference number is <strong className="text-burgundy font-mono">{order.reference}</strong>.
        </p>
        
        <div className="text-left space-y-4">
          {/* STEP 1 */}
          <div className="rounded-2xl bg-white p-5 border border-olive/10 shadow-sm">
            <h3 className="font-display text-lg text-ink mb-1">Step 1: Download Receipt</h3>
            <p className="text-sm text-olive-dark mb-4">Please download your PDF receipt. You will need to attach this in WhatsApp.</p>
            <button 
              onClick={handleDownload} 
              disabled={downloading}
              className="w-full rounded-full bg-olive px-6 py-3 font-medium text-cream shadow hover:bg-olive-dark transition disabled:opacity-50"
            >
              {downloading ? 'Generating...' : '📄 Download PDF Receipt'}
            </button>
          </div>

          {/* STEP 2 */}
          <div className="rounded-2xl bg-white p-5 border border-olive/10 shadow-sm">
            <h3 className="font-display text-lg text-ink mb-1">Step 2: Send on WhatsApp</h3>
            <p className="text-sm text-olive-dark mb-4">Tap below to open WhatsApp, then <strong>attach the PDF</strong> you just downloaded.</p>
            <a 
              href={waUrl}
              target="_blank" 
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-whatsapp px-6 py-3 font-medium text-white shadow hover:brightness-95 transition text-center"
            >
              Open WhatsApp & Attach PDF
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-olive/10 pt-6">
          <Link href={`/track/${order.reference}`} className="text-sm text-burgundy hover:underline font-medium">
            Track your order status →
          </Link>
        </div>
        
      </div>
    </div>
  );
}