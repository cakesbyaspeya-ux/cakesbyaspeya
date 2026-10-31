import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 bg-olive text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        
        {/* Brand & Socials */}
        <div>
          <h3 className="font-display text-2xl text-cream">
            Cakes by <span className="italic">Aspeya</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-cream/80">
            Custom cakes, cheesecakes, and desserts — baked fresh with love in Chittagong.
          </p>
          
          {/* Social Icon Buttons */}
          <div className="mt-6 flex gap-3">
            <a 
              href="https://www.instagram.com/_cakesbyaspeya_/?hl=en" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream hover:text-olive"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </a>
            <a 
              href="https://www.facebook.com/cakesbyaspeya" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-cream hover:text-olive"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <h4 className="font-display text-lg text-cream">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { href: '/cakes',           label: 'Our Cakes' },
              { href: '/desserts',        label: 'Desserts' },
              { href: '/custom-cake',     label: 'Custom Cake' },
              { href: '/about',           label: 'About Us' },
              { href: '/delivery-policy', label: 'Delivery Policy' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/80 transition-colors hover:text-cream">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-display text-lg text-cream">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li>
              <span className="block text-xs uppercase tracking-wide text-cream/60">WhatsApp</span>
              <a href="https://wa.me/8801519409555" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-cream">
                +880 1519 409555
              </a>
            </li>
            <li>
              <span className="block text-xs uppercase tracking-wide text-cream/60">Pickup</span>
              <span>Sanmar Ocean City / 2 No Gate<br/>Women College Mor, Chittagong</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-cream/60 sm:flex-row sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.</p>
          <p>Made with ♥ in Chittagong</p>
        </div>
      </div>
    </footer>
  );
}