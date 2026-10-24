'use client';

import { useState } from 'react';

export function CopyLinkButton({ reference }: { reference: string }) {
  const [copied, setCopied] = useState(false);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://cakesbyaspeya.vercel.app';
  const trackingLink = `${siteUrl}/track/${reference}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-full border border-olive/30 px-6 py-2.5 text-sm font-medium text-olive-dark hover:bg-olive hover:text-cream transition"
    >
      {copied ? '✓ Link Copied!' : '🔗 Copy Tracking Link'}
    </button>
  );
}