import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';

const WHATSAPP_URL =
  'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

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

  const allImages = [
    ...cakes.flatMap((cake) => cake.images || []),
    ...desserts.flatMap((dessert) => dessert.images || []),
  ];

  const bgImages = shuffleArray(allImages).slice(0, 6);

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">

      {/* HERO SECTION */}
      <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden bg-ink">

        {/* Background slideshow */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {bgImages.map((img, index) => (
            <Image
              key={`${img}-${index}`}
              src={img}
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
              style={{
                animation: `fadeSlideshow 24s infinite ${index * 4}s`,
              }}
              priority={index === 0}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 py-20 text-center">

          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-cream/70">
            Thoughtfully baked · Beautifully made
          </p>

          <h1 className="font-display text-5xl leading-[1.1] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            A little sweetness,
            <br />
            <span className="italic text-cream/90">
              a lot of love.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Discover celebration cakes and delightful desserts,
            thoughtfully prepared to make your special moments
            even sweeter.
          </p>
        </div>
      </section>

      {/* FOUR MAIN OPTIONS */}
      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Explore Cakes */}
          <Link
            href="/cakes"
            className="group flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🎂
            </span>

            <h2 className="font-display text-xl text-ink">
              Explore Cakes
            </h2>

            <p className="mt-1 text-xs text-olive-dark">
              Perfect for every celebration
            </p>
          </Link>

          {/* Explore Desserts */}
          <Link
            href="/desserts"
            className="group flex flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-xl ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🍰
            </span>

            <h2 className="font-display text-xl text-ink">
              Explore Desserts
            </h2>

            <p className="mt-1 text-xs text-olive-dark">
              Little bites of joy
            </p>
          </Link>

          {/* Custom Cake */}
          <Link
            href="/custom-cake"
            className="group flex flex-col items-center justify-center rounded-3xl bg-burgundy p-8 text-center shadow-xl shadow-burgundy/20 ring-1 ring-burgundy transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🎨
            </span>

            <h2 className="font-display text-xl text-cream">
              Custom Cake
            </h2>

            <p className="mt-1 text-xs text-cream/70">
              Your design, our creation
            </p>
          </Link>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center rounded-3xl bg-[#25D366] p-8 text-center shadow-xl shadow-[#25D366]/20 ring-1 ring-[#25D366] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              💬
            </span>

            <h2 className="font-display text-xl text-white">
              WhatsApp Us
            </h2>

            <p className="mt-1 text-xs text-white/80">
              Questions & orders
            </p>
          </a>

        </div>
      </section>

      {/* Slideshow animation */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fadeSlideshow {
              0%, 20% { opacity: 0; }
              25%, 45% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }

            @media (prefers-reduced-motion: reduce) {
              .hero-slideshow {
                animation: none !important;
              }
            }
          `,
        }}
      />
    </main>
  );
}