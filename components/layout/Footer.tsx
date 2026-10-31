import Link from 'next/link';

const EXPLORE = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/custom-cake', label: 'Custom Cakes' },
  { href: '/about', label: 'About Us' },
];

const WHATSAPP_URL = 'https://wa.me/8801519409555';

const INSTAGRAM_URL =
  'https://www.instagram.com/_cakesbyaspeya_/?hl=en';

const FACEBOOK_URL =
  'https://www.facebook.com/cakesbyaspeya';

export function Footer() {
  return (
    <footer className="mt-20 bg-[#5C6B3F] text-[#FAF3E3]">

      <div className="container-page py-14 md:py-16">

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                Cakes by <span className="italic">Aspeya</span>
              </h2>
            </Link>

            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.24em] text-cream/60">
              Baked with love
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-cream/80">
              A little sweetness, a lot of love.
              Thoughtfully baked cakes and desserts for
              your most memorable moments.
            </p>

            {/* WhatsApp */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2.5 rounded-full border border-cream/30 px-4 py-2.5 text-sm text-cream transition-all duration-300 hover:border-cream hover:bg-cream/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.1-5.2A8.4 8.4 0 1 1 21 11.5Z" />
                <path d="M9 9a5 5 0 0 0 6 6l1-1.5-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2L9 9Z" />
              </svg>

              Chat with us
            </a>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
              Explore
            </h3>

            <ul className="mt-5 space-y-3.5">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/85 transition-all duration-200 hover:pl-1 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/delivery-policy"
                  className="text-sm text-cream/85 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Delivery Information
                </Link>
              </li>

              <li>
                <Link
                  href="/track"
                  className="text-sm text-cream/85 transition-all duration-200 hover:pl-1 hover:text-white"
                >
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Social media */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/60">
              Stay Connected
            </h3>

            <p className="mt-5 text-sm leading-6 text-cream/80">
              Follow us for our latest creations,
              sweet inspirations and updates.
            </p>

            <div className="mt-5 flex items-center gap-3">

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-cream hover:text-olive-dark hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r=".7" fill="currentColor" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-cream hover:text-olive-dark hover:shadow-lg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                  fill="currentColor"
                >
                  <path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.6V5.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.3H7.4V13h2.7v8h3.4Z" />
                </svg>
              </a>
            </div>

            <address className="mt-7 not-italic text-xs leading-6 text-cream/65">
              Sanmar Ocean City · 2 No. Gate
              <br />
              Women College Circle, Chattogram
            </address>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-cream/20 pt-6 text-[11px] text-cream/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.
          </p>

          <p className="font-medium uppercase tracking-[0.15em]">
            Chattogram · Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}