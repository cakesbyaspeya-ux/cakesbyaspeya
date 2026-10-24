'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';

const NAV_LINKS = [
  { href: '/cakes',           label: 'Cakes' },
  { href: '/desserts',        label: 'Desserts' },
  { href: '/about',           label: 'About' },
  { href: '/delivery-policy', label: 'Delivery' },
  { href: '/contact',         label: 'Contact' },
];

export function Navbar() {
  const { count, mounted } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-olive/10 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <Link href="/" className="font-display text-xl text-ink">
          Cakes by <span className="text-burgundy">Aspeya</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden gap-7 text-sm md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink/80 hover:text-burgundy transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right side: cart + mobile toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/checkout"
            className="relative rounded-full bg-burgundy px-4 py-2 text-sm text-cream hover:bg-burgundy-dark transition-colors"
          >
            Cart
            {mounted && count > 0 && (
              <span className="ml-1.5 rounded-full bg-cream px-1.5 py-0.5 text-xs font-medium text-burgundy">
                {count}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full p-2 text-ink hover:bg-cream-dark md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <nav className="border-t border-olive/10 bg-cream md:hidden">
          <div className="mx-auto max-w-6xl px-4 py-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2.5 text-sm text-ink/80 hover:text-burgundy"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}