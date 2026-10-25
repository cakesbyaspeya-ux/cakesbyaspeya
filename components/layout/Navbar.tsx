
'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/about', label: 'About' },
  { href: '/delivery-policy', label: 'Delivery' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-olive/10 bg-cream/90 backdrop-blur supports-[backdrop-filter]:bg-cream/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">

        {/* LEFT SIDE: Mobile Menu + Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1.5 text-ink transition-colors hover:bg-cream-dark md:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>

          {/* Brand */}
          <Link href="/" className="z-50 font-display text-xl text-ink">
            Cakes by <span className="text-burgundy">Aspeya</span>
          </Link>
        </div>

        {/* CENTER: Desktop Navigation */}
        <nav className="hidden gap-7 text-sm md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink/80 transition-colors hover:text-burgundy"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE: Cart Emoji */}
        <div className="flex items-center">
          <Link
            href="/cart"
            aria-label="View shopping cart"
            title="Shopping Cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy text-xl transition-colors hover:bg-burgundy-dark"
          >
            <span role="img" aria-label="Shopping cart">
              🛒
            </span>
          </Link>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {open && (
        <nav className="absolute left-0 top-full w-full border-b border-olive/10 bg-cream p-4 shadow-lg md:hidden">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-cream-dark hover:text-burgundy"
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
