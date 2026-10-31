
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/custom-cake', label: 'Custom Cakes' },
  { href: '/about', label: 'Our Story' },
  { href: '/delivery-policy', label: 'Delivery' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-olive/20 bg-cream/95 shadow-sm backdrop-blur-xl'
          : 'border-b border-transparent bg-cream'
      }`}
    >
      <div className="container-page">
        <div className="flex h-[72px] items-center justify-between gap-4 md:h-[82px]">

          {/* Brand */}
          <Link
            href="/"
            className="group shrink-0"
            aria-label="Cakes by Aspeya home"
          >
            <span className="block font-display text-xl leading-none tracking-tight text-olive-dark transition-colors group-hover:text-burgundy sm:text-2xl">
              Cakes by <span className="italic">Aspeya</span>
            </span>

            <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.24em] text-olive sm:text-[10px]">
              Baked with love
            </span>
          </Link>

          {/* Navigation dropdown */}
          <div className="relative ml-auto">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-controls="navbar-dropdown"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300 ${
                open
                  ? 'bg-olive text-cream'
                  : 'bg-olive/10 text-olive-dark hover:bg-olive/20'
              }`}
            >
              <span className="hidden sm:inline">Explore</span>

              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown panel */}
            <div
              id="navbar-dropdown"
              className={`absolute right-0 top-full mt-3 w-60 origin-top-right rounded-2xl border border-olive/10 bg-cream p-3 shadow-xl shadow-olive/10 transition-all duration-200 ${
                open
                  ? 'visible translate-y-0 scale-100 opacity-100'
                  : 'invisible -translate-y-2 scale-95 opacity-0'
              }`}
            >
              <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-olive/70">
                Discover
              </p>

              <nav aria-label="Main navigation" className="flex flex-col">
                {NAV_LINKS.map((link) => {
                  const active =
                    pathname === link.href ||
                    pathname.startsWith(link.href + '/');

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-sm transition-all duration-200 ${
                        active
                          ? 'bg-olive/10 font-medium text-burgundy'
                          : 'text-ink hover:bg-olive/5 hover:pl-4'
                      }`}
                    >
                      {link.label}

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-burgundy" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Cart button — right side */}
          <Link
            href="/cart"
            aria-label="View shopping cart"
            className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream transition-all duration-300 hover:bg-olive hover:shadow-md"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 1.9-1.5L22 7H5" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Click outside to close */}
      {open && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-[-1] cursor-default"
          onClick={() => setOpen(false)}
        />
      )}
    </header>
  );
}
