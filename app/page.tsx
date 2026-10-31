import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';

const WHATSAPP_URL = 'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

function shuffleArray(array: string[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default async function HomePage() {
  const [cakes, desserts] = await Promise.all([
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  // Gather all images and pick 6 random ones for the background
  const allImages = [
    ...cakes.flatMap((c) => c.images || []),
    ...desserts.flatMap((d) => d.images || []),
  ];
  const bgImages = shuffleArray(allImages).slice(0, 6);

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">
      
      {/* ── HERO SECTION WITH FADED SLIDESHOW ── */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-ink">
        
        {/* Background Slideshow */}
        <div className="absolute inset-0 z-0 opacity-40">
          {bgImages.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="Cake background"
              fill
              className={`object-cover transition-opacity duration-[4000ms] ease-in-out ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
              style={{ animation: `fadeSlideshow 24s infinite ${i * 4}s` }}
              priority={i === 0}
            />
          ))}
          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Motto Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cream/70 mb-4 animate-[fadeInUp_0.8s_ease-out_both]">
            Freshly baked in Chattogram
          </p>
          <h1 className="font-display text-5xl leading-[1.1] text-cream sm:text-6xl md:text-7xl lg:text-8xl animate-[fadeInUp_1s_ease-out_both]">
            A little sweetness,<br />
            <span className="italic text-cream/90">a lot of love.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg animate-[fadeInUp_1.2s_ease-out_both]">
            Discover celebration cakes and delightful desserts, thoughtfully prepared to make your special moments even sweeter.
          </p>
        </div>
      </section>

      {/* ── 4 MAIN OPTIONS ── */}
      <section className="relative z-20 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Link href="/cakes" className="group flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🎂</span>
            <h3 className="font-display text-xl text-ink">Explore Cakes</h3>
            <p className="text-xs text-olive-dark mt-1">Perfect for every celebration</p>
          </Link>

          <Link href="/desserts" className="group flex flex-col items-center justify-center rounded-3xl bg-white p-8 shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🍰</span>
            <h3 className="font-display text-xl text-ink">Explore Desserts</h3>
            <p className="text-xs text-olive-dark mt-1">Little bites of joy</p>
          </Link>

          <Link href="/custom-cake" className="group flex flex-col items-center justify-center rounded-3xl bg-burgundy p-8 shadow-xl shadow-burgundy/20 ring-1 ring-burgundy transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">🖼️</span>
            <h3 className="font-display text-xl text-cream">Custom Cake</h3>
            <p className="text-xs text-cream/70 mt-1">Upload your own design</p>
          </Link>

          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center justify-center rounded-3xl bg-[#25D366] p-8 shadow-xl shadow-[#25D366]/20 ring-1 ring-[#25D366] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
            <span className="text-4xl mb-4 group-hover:scale-110 transition-transform">💬</span>
            <h3 className="font-display text-xl text-white">WhatsApp Us</h3>
            <p className="text-xs text-white/80 mt-1">Quick questions & orders</p>
          </a>

        </div>
      </section>

      {/* CSS Animation for Slideshow */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeSlideshow {
          0%, 20% { opacity: 0; }
          25%, 45% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}} />

    </main>
  );
}