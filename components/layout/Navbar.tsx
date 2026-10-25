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
    <header className="sticky top-0 z-50 border-b border-olive/10 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        
        {/* ── LEFT SIDE: Mobile Menu Toggle + Brand ── */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button (Mobile Only) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1.5 text-ink hover:bg-cream-dark transition-colors md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>

          {/* Brand */}
          <Link href="/" className="font-display text-xl text-ink z-50">
            Cakes by <span className="text-burgundy">Aspeya</span>
          </Link>
        </div>

        {/* ── CENTER: Desktop Navigation ── */}
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

        {/* ── RIGHT SIDE: Cart ── */}
        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative rounded-full bg-burgundy px-4 py-2 text-sm text-cream hover:bg-burgundy-dark transition-colors"
          >
            Cart
            {mounted && count > 0 && (
              <span className="ml-1.5 rounded-full bg-cream px-1.5 py-0.5 text-xs font-medium text-burgundy">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {open && (
        <nav className="absolute left-0 top-full w-full border-b border-olive/10 bg-cream p-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-ink/80 hover:bg-cream-dark hover:text-burgundy transition-colors"
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