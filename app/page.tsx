
import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';

const WHATSAPP_URL =
  'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

export default async function HomePage() {
  const [cakes, desserts] = await Promise.all([
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const allImages = [
    ...cakes.flatMap((cake) => cake.images || []),
    ...desserts.flatMap((dessert) => dessert.images || []),
  ];

  const bgImages = allImages.slice(0, 5);

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">

      {/* Hero */}
      <section className="relative flex min-h-[72vh] items-center justify-center overflow-hidden bg-olive-dark sm:min-h-[80vh]">

        {/* Background slideshow */}
        <div className="absolute inset-0">
          {bgImages.map((img, index) => (
            <Image
              key={img}
              src={img}
              alt=""
              fill
              sizes="100vw"
              priority={index === 0}
              className="object-cover"
              style={{
                opacity: index === 0 ? 0.4 : 0,
              }}
            />
          ))}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-20 text-center">

          <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.3em] text-cream/75 sm:text-xs">
            Thoughtfully baked · Beautifully made
          </p>

          <h1 className="font-display text-5xl leading-[1.12] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
            A little sweetness,
            <br />
            <span className="italic text-cream/90">
              a lot of love.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-cream/80 sm:text-base sm:leading-8">
            Discover celebration cakes and delightful desserts,
            thoughtfully prepared to make your special moments
            even sweeter.
          </p>

          <div className="mt-9 flex justify-center">
            <Link
              href="/cakes"
              className="inline-flex items-center gap-3 rounded-full bg-cream px-7 py-3.5 text-sm font-medium text-olive-dark transition-all duration-300 hover:bg-white hover:shadow-lg"
            >
              Discover our creations

              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Main navigation cards */}
      <section className="relative z-10 mx-auto -mt-10 max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Cakes */}
          <Link
            href="/cakes"
            className="group flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-8 text-center shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🎂
            </span>

            <h2 className="font-display text-xl text-ink">
              Explore Cakes
            </h2>

            <p className="mt-2 text-xs text-olive-dark/80">
              For every celebration
            </p>
          </Link>

          {/* Desserts */}
          <Link
            href="/desserts"
            className="group flex flex-col items-center justify-center rounded-2xl bg-white px-6 py-8 text-center shadow-md ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🍰
            </span>

            <h2 className="font-display text-xl text-ink">
              Explore Desserts
            </h2>

            <p className="mt-2 text-xs text-olive-dark/80">
              Little bites of joy
            </p>
          </Link>

          {/* Custom cake */}
          <Link
            href="/custom-cake"
            className="group flex flex-col items-center justify-center rounded-2xl bg-burgundy px-6 py-8 text-center shadow-md shadow-burgundy/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              🎨
            </span>

            <h2 className="font-display text-xl text-cream">
              Custom Cakes
            </h2>

            <p className="mt-2 text-xs text-cream/70">
              Your dream, our creation
            </p>
          </Link>

          {/* WhatsApp */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col items-center justify-center rounded-2xl bg-[#25D366] px-6 py-8 text-center shadow-md shadow-[#25D366]/15 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <span className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
              💬
            </span>

            <h2 className="font-display text-xl text-white">
              WhatsApp Us
            </h2>

            <p className="mt-2 text-xs text-white/80">
              We&apos;d love to hear from you
            </p>
          </a>
        </div>
      </section>

    </main>
  );
}
