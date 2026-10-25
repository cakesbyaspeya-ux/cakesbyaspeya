'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/about', label: 'Our Story' },
  { href: '/delivery-policy', label: 'Delivery' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu whenever the page changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50">
      {/* Main navbar */}
      <div className="border-b border-olive/10 bg-cream/90 shadow-[0_4px_25px_rgba(65,77,44,0.04)] backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT: Mobile menu + Brand */}
          <div className="flex min-w-0 items-center gap-3">

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setOpen((previous) => !previous)}
              className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-olive/10 bg-white/60 text-ink transition-all duration-300 hover:border-burgundy/30 hover:bg-burgundy/5 md:hidden"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              <svg
                className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>

            {/* Brand */}
            <Link
              href="/"
              aria-label="Cakes by Aspeya homepage"
              className="group relative flex shrink-0 items-center gap-2.5"
            >
              {/* Decorative brand mark */}
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-burgundy/15 bg-burgundy/[0.06] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-burgundy/40 group-hover:bg-burgundy/10">
                <svg
                  viewBox="0 0 40 40"
                  className="h-7 w-7 text-burgundy transition-transform duration-500 group-hover:scale-110"
                  fill="none"
                >
                  <path
                    d="M9 27h22M12 27v-5c0-2 2-3 4-3h8c2 0 4 1 4 3v5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11 19c-3-2-2-6 1-7 1-4 5-4 7-1 3-4 8-2 8 2 4 0 5 5 2 7"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 5v3m-7 1-2-2m16 2 2-2M20 14v2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="32" r="1" fill="currentColor" />
                </svg>
              </div>

              <div className="flex flex-col">
                <span className="font-display text-lg leading-tight tracking-tight text-ink sm:text-xl">
                  Cakes by{' '}
                  <span className="text-burgundy">Aspeya</span>
                </span>
                <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.25em] text-olive/80 sm:text-[9px]">
                  Baked with love
                </span>
              </div>
            </Link>
          </div>

          {/* CENTER: Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex lg:gap-2"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative rounded-full px-3 py-2.5 text-[13px] font-medium transition-colors duration-300 lg:px-4 lg:text-sm ${
                    isActive
                      ? 'text-burgundy'
                      : 'text-ink/70 hover:text-burgundy'
                  }`}
                >
                  {link.label}

                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-1.5 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-burgundy transition-all duration-300 ${
                      isActive
                        ? 'w-5'
                        : 'w-0 group-hover:w-5'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Shopping cart */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <span className="hidden text-right lg:block">
              <span className="block text-[9px] font-medium uppercase tracking-[0.18em] text-olive/70">
                Your favourites
              </span>
              <span className="mt-0.5 block text-xs font-semibold text-ink">
                Sweet treats
              </span>
            </span>

            <Link
              href="/cart"
              aria-label="View shopping cart"
              title="Shopping cart"
              className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-burgundy text-white shadow-md shadow-burgundy/15 transition-all duration-300 hover:scale-105 hover:bg-burgundy-dark hover:shadow-lg hover:shadow-burgundy/25 active:scale-95 sm:h-12 sm:w-12"
            >
              {/* Soft hover glow */}
              <span className="absolute inset-0 translate-y-full rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-y-0" />

              <svg
                className="relative h-5 w-5 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L22 8H6" />
                <circle cx="10" cy="20" r="1.2" />
                <circle cx="18" cy="20" r="1.2" />
              </svg>

              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cream ring-2 ring-burgundy" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        aria-hidden={!open}
        className={`absolute left-0 right-0 top-full border-b border-olive/10 bg-cream/95 shadow-xl shadow-olive/10 backdrop-blur-xl transition-all duration-300 ease-out md:hidden ${
          open
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 pointer-events-none opacity-0'
        }`}
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto max-w-7xl px-4 pb-5 pt-3 sm:px-6"
        >
          <p className="mb-3 px-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-olive/70">
            Explore our bakery
          </p>

          <div className="space-y-1">
            {NAV_LINKS.map((link, index) => {
              const isActive =
                pathname === link.href ||
                pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  tabIndex={open ? 0 : -1}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  style={{
                    transitionDelay: open ? `${index * 45}ms` : '0ms',
                  }}
                  className={`group flex items-center justify-between rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-300 ${
                    open
                      ? 'translate-x-0 opacity-100'
                      : '-translate-x-2 opacity-0'
                  } ${
                    isActive
                      ? 'bg-burgundy/[0.07] text-burgundy'
                      : 'text-ink/80 hover:bg-olive/[0.06] hover:text-burgundy'
                  }`}
                >
                  <span>{link.label}</span>

                  <svg
                    className={`h-4 w-4 transition-all duration-300 ${
                      isActive
                        ? 'translate-x-0 text-burgundy'
                        : '-translate-x-1 text-olive/40 group-hover:translate-x-0 group-hover:text-burgundy'
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14m-6-6 6 6-6 6" />
                  </svg>
                </Link>
              );
            })}
          </div>

          {/* Mobile promotional footer */}
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-olive/10 bg-white/60 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-burgundy/[0.07] text-burgundy">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3c1.4 3.2 2.8 4.6 6 6-3.2 1.4-4.6 2.8-6 6-1.4-3.2-2.8-4.6-6-6 3.2-1.4 4.6-2.8 6-6Z" />
                <path d="m19 15 1.2 2.8L23 19l-2.8 1.2L19 23l-1.2-2.8L15 19l2.8-1.2L19 15Z" />
              </svg>
            </div>

            <div>
              <p className="font-display text-sm text-ink">
                Made for your special moments
              </p>
              <p className="mt-1 text-xs text-ink/60">
                Freshly baked, beautifully crafted.
              </p>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}