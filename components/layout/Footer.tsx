import Link from 'next/link';

const EXPLORE = [
  { href: '/cakes', label: 'Cakes' },
  { href: '/desserts', label: 'Desserts' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const INFO = [
  { href: '/delivery-policy', label: 'Delivery policy' },
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/track', label: 'Track an order' },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="container-page py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">

          {/* Brand */}
          <div className="md:col-span-5 lg:col-span-4">
            <p className="font-display text-xl leading-none text-ink">Cakes by Aspeya</p>
            <p className="mt-2 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-ink-muted">
              Baked in Chattogram
            </p>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-light">
              Handcrafted cakes and desserts, baked to order for the moments that matter.
              Delivered across Chattogram, or ready for pickup in the city.
            </p>

            <a
              href="https://wa.me/8801519409555"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-burgundy transition-colors"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 20l1.1-5.2A8.4 8.4 0 1 1 21 11.5Z" />
                <path d="M9 9a5 5 0 0 0 6 6l1-1.5-2-1-1 1a4 4 0 0 1-2.5-2.5l1-1-1-2L9 9Z" />
              </svg>
              +880 1519 409555
            </a>
          </div>

          <div className="md:col-span-1 md:col-start-6" />

          {/* Explore */}
          <div className="md:col-span-2">
            <h3 className="eyebrow">Explore</h3>
            <ul className="mt-4 space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-light hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div className="md:col-span-2">
            <h3 className="eyebrow">Information</h3>
            <ul className="mt-4 space-y-3">
              {INFO.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-ink-light hover:text-ink transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / social */}
          <div className="md:col-span-2">
            <h3 className="eyebrow">Follow</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a href="https://www.facebook.com/cakesbyaspeya" target="_blank" rel="noopener noreferrer" className="text-sm text-ink-light hover:text-ink transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/_cakesbyaspeya_/?hl=en" target="_blank" rel="noopener noreferrer" className="text-sm text-ink-light hover:text-ink transition-colors">
                  Instagram
                </a>
              </li>
            </ul>

            <address className="mt-6 not-italic text-sm leading-relaxed text-ink-muted">
              Sanmar Ocean City · 2 No. Gate<br />
              Women College Circle, Chattogram
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[var(--color-border)] pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.</p>
          <p>Chattogram · Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}