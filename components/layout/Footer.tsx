import Link from 'next/link';

const EXPLORE_LINKS = [
  { href: '/cakes', label: 'Our Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/about', label: 'Our Story' },
  { href: '/delivery-policy', label: 'Delivery Policy' },
  { href: '/contact', label: 'Contact Us' },
];

const LEGAL_LINKS = [
  { href: '/trust', label: 'Business Info (TIN)' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

const SOCIAL_LINKS = [
  {
    href: 'https://www.facebook.com/cakesbyaspeya',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.4-.1-2.6-.1-2.6 0-4.4 1.6-4.4 4.5v2.1H7v3.2h2.8V21h3.7Z" />
      </svg>
    ),
  },
  {
    href: 'https://www.instagram.com/_cakesbyaspeya_/?hl=en',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
          stroke="currentColor"
          strokeWidth="1.7"
        />
        <circle cx="17.5" cy="6.7" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden bg-olive text-cream">

      {/* Decorative background accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-cream/[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-cream/[0.08]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cream/[0.03] blur-3xl"
      />

      {/* Main footer */}
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16 lg:px-10 lg:pt-20">

        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">

          {/* BRAND */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              aria-label="Cakes by Aspeya homepage"
              className="group inline-flex items-center gap-3"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-cream/20 bg-cream/[0.07] transition-all duration-500 group-hover:rotate-[-8deg] group-hover:border-cream/50 group-hover:bg-cream/[0.13]">
                <svg
                  viewBox="0 0 40 40"
                  fill="none"
                  className="h-9 w-9 text-cream transition-transform duration-500 group-hover:scale-110"
                >
                  <path
                    d="M8 28h24M11 28v-5c0-2 2-4 4-4h10c2 0 4 2 4 4v5"
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
                    d="M20 5v3m-7 1-2-2m16 2 2-2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle cx="20" cy="33" r="1" fill="currentColor" />
                </svg>
              </div>

              <div>
                <h2 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                  Cakes by{' '}
                  <span className="italic text-cream/80">Aspeya</span>
                </h2>
                <p className="mt-1.5 text-[9px] font-medium uppercase tracking-[0.3em] text-cream/55">
                  Baked with love
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-cream/70">
              Turning your sweetest moments into beautiful memories with
              custom cakes and delightful desserts, freshly made in
              Chattogram.
            </p>

            {/* Social links */}
            <div className="mt-7 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit our ${social.label} page`}
                  className="group flex h-11 w-11 items-center justify-center rounded-full border border-cream/20 text-cream/80 transition-all duration-300 hover:-translate-y-1 hover:border-cream hover:bg-cream hover:text-olive hover:shadow-lg hover:shadow-black/10"
                >
                  {social.icon}
                </a>
              ))}
              <span className="ml-1 text-xs text-cream/50">
                Follow our journey
              </span>
            </div>
          </div>

          {/* EXPLORE */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="font-display text-xl">
              Explore
            </h3>

            <div className="mb-5 mt-3 h-px w-10 bg-cream/40" />

            <ul className="space-y-3.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors duration-300 hover:text-cream"
                  >
                    <span className="h-px w-0 bg-cream transition-all duration-300 group-hover:w-3" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* INFORMATION */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-xl">
              Information
            </h3>

            <div className="mb-5 mt-3 h-px w-10 bg-cream/40" />

            <ul className="space-y-3.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-cream/70 transition-colors duration-300 hover:text-cream"
                  >
                    <span className="h-px w-0 bg-cream transition-all duration-300 group-hover:w-3" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="sm:col-span-2 lg:col-span-3">
            <h3 className="font-display text-xl">
              Let's connect
            </h3>

            <div className="mb-5 mt-3 h-px w-10 bg-cream/40" />

            {/* WhatsApp card */}
            <a
              href="https://wa.me/8801519409555"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-2xl border border-cream/15 bg-cream/[0.05] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cream/30 hover:bg-cream/[0.09]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream/10 transition-colors duration-300 group-hover:bg-cream/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.1-5.2A8.4 8.4 0 1 1 21 11.5Z" />
                  <path d="M9 9a5 5 0 0 0 6 6l1-1.5-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2L9 9Z" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-cream/55">
                  Order or enquire
                </p>
                <p className="mt-1 text-sm font-medium transition-colors group-hover:text-white">
                  +880 1519 409555
                </p>
              </div>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-auto h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </a>

            {/* Location */}
            <div className="mt-5 flex items-start gap-3">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mt-0.5 h-5 w-5 shrink-0 text-cream/70"
              >
                <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>

              <p className="text-sm leading-6 text-cream/70">
                Sanmar Ocean City / 2 No Gate
                <br />
                Women College Circle, Chattogram
              </p>
            </div>

            <p className="mt-4 flex items-center gap-2 text-xs text-cream/55">
              <span className="h-1.5 w-1.5 rounded-full bg-cream/70" />
              Serving sweet moments in Chattogram
            </p>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="my-10 flex items-center gap-4 sm:my-12">
          <div className="h-px flex-1 bg-cream/15" />
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="h-5 w-5 text-cream/45"
          >
            <path d="M12 3c1.5 4 3 5.5 7 7-4 1.5-5.5 3-7 7-1.5-4-3-5.5-7-7 4-1.5 5.5-3 7-7Z" />
          </svg>
          <div className="h-px flex-1 bg-cream/15" />
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-5 text-cream/55">
            © {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.
          </p>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-cream"
          >
            Crafted with care
            <span className="inline-block text-base text-cream/80 transition-transform duration-300 group-hover:-translate-y-1">
              ↑
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}