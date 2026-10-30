'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/about', label: 'About' },
  { href: '/delivery-policy', label: 'Delivery' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        scrolled
          ? 'border-[var(--color-border)] bg-[var(--color-cream)]/95 backdrop-blur-md'
          : 'border-transparent bg-[var(--color-cream)]'
      }`}
    >
      <div className="container-page">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[72px]">

          {/* Brand */}
          <Link href="/" className="shrink-0" aria-label="Cakes by Aspeya — home">
            <span className="block font-display text-[1.35rem] leading-none tracking-tight text-ink md:text-2xl">
              Cakes by Aspeya
            </span>
            <span className="mt-1 block text-[0.6rem] font-medium uppercase tracking-[0.24em] text-ink-muted">
              Baked in Chattogram
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative py-1 text-[0.9375rem] transition-colors ${
                    active ? 'text-ink' : 'text-ink-light hover:text-ink'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-burgundy transition-all duration-200 ${
                      active ? 'w-full' : 'w-0'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/cart"
              className="hidden rounded-md border border-[var(--color-border)] bg-transparent px-3.5 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink sm:inline-flex"
            >
              Cart
            </Link>
            <Link href="/cakes" className="btn-primary !py-2.5 !px-4 text-[0.875rem]">
              Order now
            </Link>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--color-border)] text-ink md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-nav"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-cream)] transition-[max-height,opacity] duration-300 md:hidden ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav aria-label="Mobile" className="container-page flex flex-col py-3">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-[var(--color-border)] py-3 text-[0.9375rem] last:border-0 ${
                  active ? 'text-burgundy' : 'text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="mt-3 rounded-md border border-[var(--color-border)] px-3 py-2.5 text-center text-[0.9375rem] font-medium"
          >
            View cart
          </Link>
        </nav>
      </div>
    </header>
  );
}