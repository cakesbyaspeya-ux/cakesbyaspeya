'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderConfirmedPage() {
  const { ref } = useParams<{ ref: string }>();
  const [waUrl, setWaUrl] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem('cba_last_order');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.ref === ref) setWaUrl(parsed.waUrl);
    }
  }, [ref]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 md:py-24">
      <div className="rounded-3xl bg-cream-card p-8 md:p-12 ring-1 ring-black/5 text-center shadow-soft">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-olive/15 text-4xl mb-6">
          ✓
        </div>
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-2">Order Received!</h1>
        <p className="text-olive-dark mb-6">
          Your reference number is <strong className="text-burgundy">{ref}</strong>.
        </p>
        
        <div className="bg-cream-dark/50 p-6 rounded-2xl mb-8">
          <p className="text-sm text-ink font-medium mb-4">
            If WhatsApp didn't open automatically, please tap the button below to send us your order details.
          </p>
          {waUrl ? (
            <a 
              href={waUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-whatsapp px-8 py-3 font-medium text-white shadow hover:brightness-95 transition"
            >
              Open WhatsApp
            </a>
          ) : (
            <p className="text-sm text-burgundy">Error: WhatsApp link not found. Please message us with your reference number.</p>
          )}
        </div>

        <Link href="/" className="text-sm text-olive-dark hover:text-burgundy hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}