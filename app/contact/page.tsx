export const metadata = {
  title: 'Contact Us',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl text-ink md:text-5xl mb-4">Get in Touch</h1>
        <p className="text-olive-dark max-w-xl mx-auto">
          Have a question about a custom design, or ready to place an order? We are always just a message away.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* WhatsApp Card */}
        <a 
          href="https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20have%20a%20question."
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl bg-whatsapp p-8 text-white transition hover:brightness-95 shadow-soft"
        >
          <div className="text-4xl mb-4">💬</div>
          <h2 className="font-display text-2xl mb-2">WhatsApp Us</h2>
          <p className="text-white/90 text-sm mb-4">The fastest way to get a reply. Tap here to open WhatsApp.</p>
          <p className="font-medium">+880 1519 409555</p>
        </a>

        {/* Social Card */}
        <div className="rounded-2xl bg-cream-card p-8 ring-1 ring-black/5 shadow-soft">
          <div className="text-4xl mb-4 text-ink">📱</div>
          <h2 className="font-display text-2xl text-ink mb-2">Follow Us</h2>
          <p className="text-olive-dark text-sm mb-4">See our latest bakes and behind-the-scenes on social media.</p>
          <div className="flex flex-col gap-2 text-sm font-medium">
            <a href="https://www.facebook.com/cakesbyaspeya" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline">
              → Facebook
            </a>
            <a href="https://www.instagram.com/_cakesbyaspeya_/?hl=en" target="_blank" rel="noopener noreferrer" className="text-burgundy hover:underline">
              → Instagram
            </a>
          </div>
        </div>
      </div>

      {/* Pickup Address */}
      <div className="mt-8 rounded-2xl bg-olive p-8 text-cream text-center">
        <h2 className="font-display text-2xl mb-2">Pickup Location</h2>
        <p className="text-cream/80 max-w-md mx-auto">
          Sanmar Ocean City / 2 No Gate / Women College Mor, Chittagong
        </p>
      </div>
    </div>
  );
}