'use client';

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Handcrafted cakes, made just for your moments',
  'Custom designs made with care in Chattogram',
  'Choose your flavour, share your vision, let us bake',
];

export function AnnouncementBar() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % MESSAGES.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      aria-live="polite"
      className="relative flex min-h-10 items-center justify-center overflow-hidden bg-olive px-4 py-2 text-center text-xs font-medium tracking-wide text-cream sm:text-sm"
    >
      <span key={active} className="animate-[fadeInUp_0.45s_ease-out_both]">
        <span aria-hidden="true" className="mr-2 text-cream/70">✦</span>
        {MESSAGES[active]}
        <span aria-hidden="true" className="ml-2 text-cream/70">✦</span>
      </span>
    </div>
  );
}
