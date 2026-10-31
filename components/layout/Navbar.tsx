'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/CartProvider';

const NAV_LINKS = [
  { href: '/cakes',           label: 'Cakes' },
  { href: '/desserts',        label: 'Desserts' },
  { href: '/custom-cake',     label: 'Custom Cake' },
  { href: '/about',           label: 'About' },
  { href: '/contact',         label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cream/90 backdrop-blur-lg shadow-sm border-b border-olive/10 py-3' 
        : 'bg-cream py-4'
    }`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* ── LEFT SIDE: Mobile Menu Toggle + Brand ── */}
        <div className="flex items-center gap-3">
          {/* Hamburger Button (Mobile Only) */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1.5 text-ink hover:bg-cream-dark transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>

          {/* Brand */}
          <Link href="/" className="font-display text-2xl text-ink tracking-tight">
            Cakes by <span className="text-burgundy italic">Aspeya</span>
          </Link>
        </div>

        {/* ── CENTER: Desktop Navigation ── */}
        <nav className="hidden gap-8 text-sm font-medium md:flex">
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

        {/* ── RIGHT SIDE: Cart Icon ── */}
        <div className="flex items-center">
          <Link
            href="/cart"
            aria-label="View Cart"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-cream shadow-md hover:bg-burgundy-dark transition-transform hover:scale-105"
          >
            <span className="text-xl">🛒</span>
          </Link>
        </div>
      </div>

      {/* ── MOBILE DROPDOWN MENU ── */}
      {open && (
        <nav className="absolute left-0 top-full w-full border-b border-olive/10 bg-cream p-4 shadow-xl md:hidden">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-ink hover:bg-cream-dark hover:text-burgundy transition-colors"
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