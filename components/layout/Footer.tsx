import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 bg-olive text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="font-display text-2xl">
            Cakes by <span className="italic">Aspeya</span>
          </h3>
          <p className="mt-3 text-sm text-cream/80">
            Custom cakes and desserts, baked fresh in Chittagong.
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-display text-lg">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cakes" className="hover:text-white">Our Cakes</Link></li>
            <li><Link href="/desserts" className="hover:text-white">Desserts</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/trust" className="hover:text-white">Business Info (TIN)</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg">Get in touch</h4>
          <ul className="mt-3 space-y-3 text-sm text-cream/80">
            <li>
              <a
                href="https://wa.me/8801519409555"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                WhatsApp: +880 1519 409555
              </a>
            </li>
            <li>
              Sanmar Ocean City / 2 No Gate
              <br />
              Women College Circle, Chittagong
            </li>
          </ul>

          {/* Social buttons */}
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://www.facebook.com/cakesbyaspeya"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/30 px-4 py-2 text-sm transition-colors hover:bg-cream hover:text-olive"
            >
              Facebook
            </a>
            <a
              href="https://www.instagram.com/_cakesbyaspeya_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-cream/30 px-4 py-2 text-sm transition-colors hover:bg-cream hover:text-olive"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-cream/15 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.
      </div>
    </footer>
  );
}