import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 bg-olive text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <h3 className="font-display text-2xl">
            Cakes by <span className="italic">Aspeya</span>
          </h3>
          <p className="mt-3 text-sm text-cream/80">
            Custom cakes and desserts, baked fresh in Chittagong.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/cakes" className="hover:text-white">Our Cakes</Link></li>
            <li><Link href="/desserts" className="hover:text-white">Desserts</Link></li>
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Get in touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/80">
            <li>
              <a href="https://wa.me/8801519409555" target="_blank" rel="noopener noreferrer">
                WhatsApp: +880 1519 409555
              </a>
            </li>
            <li>
              Sanmar Ocean City / 2 No Gate<br />
              Women College Mor, Chittagong
            </li>
            <li className="flex gap-4">
              <a href="https://www.facebook.com/cakesbyaspeya" target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
              <a href="https://www.instagram.com/_cakesbyaspeya_/?hl=en" target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15 py-5 text-center text-xs text-cream/60">
        © {new Date().getFullYear()} Cakes by Aspeya. All rights reserved.
      </div>
    </footer>
  );
}