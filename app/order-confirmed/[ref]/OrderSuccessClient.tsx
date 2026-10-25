'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { generateReceiptPdf } from '@/lib/generateReceiptPdf';

export function OrderSuccessClient({ order }: { order: any }) {
  const [downloading, setDownloading] = useState(false);
  const [autoDownloaded, setAutoDownloaded] = useState(false);
  
  // Use a ref to ensure we only attempt the auto-download once
  const hasAttemptedAutoDownload = useRef(false);

  // 1. Function to generate and download PDF
  function downloadPdf() {
    setDownloading(true);
    try {
      const doc = generateReceiptPdf(order);
      doc.save(`Receipt-${order.reference}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
    } finally {
      setDownloading(false);
    }
  }

  // 2. Auto-download when the page loads
  useEffect(() => {
    if (!hasAttemptedAutoDownload.current) {
      hasAttemptedAutoDownload.current = true;
      
      // Small delay to ensure the page has rendered before triggering the download
      const timer = setTimeout(() => {
        downloadPdf();
        setAutoDownloaded(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [order]); // Dependency array

  // 3. Build the WhatsApp Message
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8801519409555';
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.vercel.app';
  const trackingUrl = `${siteUrl}/track/${order.reference}`;
  
  const waMessage = `Hi Cakes by Aspeya! I would like to confirm my order *${order.reference}*.\n\nHere is my order tracking link:\n${trackingUrl}`;
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
          {/* STEP 1 (Auto Download UI) */}
          <div className="rounded-2xl bg-white p-5 border border-olive/10 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg text-ink">
                {autoDownloaded ? 'Step 1: Receipt Downloaded' : 'Step 1: Downloading Receipt...'}
              </h3>
              {autoDownloaded && <span className="text-olive font-bold">✓</span>}
            </div>
            
            <p className="text-sm text-olive-dark mb-4">
              {autoDownloaded 
                ? "Your PDF receipt should have downloaded automatically. You will need to attach it in WhatsApp."
                : "Please wait while we generate your PDF receipt."}
            </p>
            
            {/* Fallback button if the browser blocked the auto-download */}
            <button 
              onClick={downloadPdf} 
              disabled={downloading}
              className={`w-full rounded-full px-6 py-3 font-medium transition shadow-sm ${
                autoDownloaded 
                  ? 'bg-cream-dark text-olive-dark hover:bg-olive hover:text-cream' 
                  : 'bg-olive text-cream hover:bg-olive-dark'
              }`}
            >
              {downloading ? 'Generating...' : autoDownloaded ? 'Download Again' : '📄 Click to Download'}
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
            Track your order status here →
          </Link>
        </div>
        
      </div>
    </div>
  );
}