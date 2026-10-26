'use client';

import { useEffect, useState } from 'react';

const DEFAULT_MESSAGES = [
  'Handcrafted cakes, made just for your moments',
  'Custom designs made with care in Chattogram',
  'Choose your flavour, share your vision, let us bake',
];

export function AnnouncementBarClient({ adminNotice, isOpen }: { adminNotice?: string, isOpen: boolean }) {
  // If the admin typed a custom notice in settings, use that. Otherwise, use the defaults.
  const messages = adminNotice ? [adminNotice] : DEFAULT_MESSAGES;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % messages.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [messages.length]);

  // If ordering is paused, show the red burgundy warning instead
  if (!isOpen) {
    return (
      <div className="bg-burgundy px-4 py-2 text-center text-xs font-medium tracking-wide text-cream sm:text-sm">
        ⚠️ We are currently pausing new orders. Please check back later.
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      className="relative flex min-h-10 items-center justify-center overflow-hidden bg-olive px-4 py-2 text-center text-xs font-medium tracking-wide text-cream sm:text-sm"
    >
      <span key={active} className="animate-[fadeInUp_0.45s_ease-out_both]">
        <span aria-hidden="true" className="mr-2 text-cream/70">✦</span>
        {messages[active]}
        <span aria-hidden="true" className="ml-2 text-cream/70">✦</span>
      </span>
    </div>
  );
}