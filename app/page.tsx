
import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';

export default async function HomePage() {
  const [cakes, desserts] = await Promise.all([
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const heroImage = cakes.find((cake) => cake.images.length > 0)?.images[0];

  return (
    <div>
      {/* HERO SECTION */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-10 md:pb-16 md:pt-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full bg-burgundy/10 px-3 py-1 text-xs font-medium tracking-wide text-burgundy">
              Fresh-baked in Chittagong
            </span>

            <h1 className="mt-5 font-display text-4xl leading-tight text-ink md:text-5xl lg:text-6xl">
              Cakes by <span className="text-burgundy">Aspeya</span>
            </h1>

            <p className="mt-4 max-w-md text-base leading-relaxed text-olive-dark md:text-lg">
              From custom cakes and creamy cheesecakes to delightful
              desserts, every treat is freshly baked with love and
              crafted to make your moments extra special. Enjoy
              convenient doorstep delivery or pick up your order fresh.
            </p>

            <p className="mt-2 text-sm text-olive-dark/80">
              Please place your order at least 24 hours in advance.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/cakes"
                className="rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-burgundy-dark"
              >
                Browse Cakes
              </Link>

              <a
                href="https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order."
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-olive px-6 py-3 text-sm font-medium text-olive-dark transition-colors hover:bg-olive hover:text-cream"
              >
                Order on WhatsApp
              </a>
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-dark shadow-soft">
            {heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
                            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                alt="Instagram post" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <img
                src={heroImage}
                alt="Featured cake by Cakes by Aspeya"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <span className="text-8xl opacity-30">🎂</span>
                <span className="font-display text-xl text-olive-dark/50">
                  Your cake photo here
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CAKES SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Our Cakes
            </h2>

            <p className="mt-2 text-sm text-olive-dark">
              Every cake customisable · 0.5 lb to 3 lb
            </p>
          </div>

          <Link
            href="/cakes"
            className="hidden shrink-0 text-sm text-burgundy hover:underline md:inline"
          >
            View all →
          </Link>
        </div>

        {cakes.length === 0 ? (
          <p className="rounded-2xl bg-cream-card p-8 text-center text-sm text-olive-dark ring-1 ring-black/5">
            No cakes yet. Add some in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {cakes.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/cakes"
            className="text-sm text-burgundy hover:underline"
          >
            View all cakes →
          </Link>
        </div>
      </section>

      {/* DESSERTS SECTION */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl text-ink md:text-4xl">
              Desserts
            </h2>

            <p className="mt-2 text-sm text-olive-dark">
              Perfect add-ons for any celebration
            </p>
          </div>

          <Link
            href="/desserts"
            className="hidden shrink-0 text-sm text-burgundy hover:underline md:inline"
          >
            View all →
          </Link>
        </div>

        {desserts.length === 0 ? (
          <p className="rounded-2xl bg-cream-card p-8 text-center text-sm text-olive-dark ring-1 ring-black/5">
            No desserts yet. Add some in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
            {desserts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/desserts"
            className="text-sm text-burgundy hover:underline"
          >
            View all desserts →
          </Link>
        </div>
      </section>

      {/* TOP CURVED DIVIDER */}
      <div className="relative h-12 w-full bg-cream md:h-24">
        <svg
          className="absolute bottom-0 h-full w-full text-olive"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 74H1440V35.0345C1440 35.0345 1224 0 720 0C216 0 0 35.0345 0 35.0345V74Z" />
        </svg>
      </div>

      {/* HOW TO ORDER SECTION */}
      <section className="bg-olive pb-16 pt-4 text-cream">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center font-display text-3xl md:text-4xl">
            How to Order
          </h2>

          <p className="mt-2 text-center text-sm text-cream/80">
            Three simple steps — no account needed.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                n: '1',
                title: 'Pick your cake',
                desc: 'Choose your size, flavour, and a personal message.',
              },
              {
                n: '2',
                title: 'Fill delivery info',
                desc: 'Name, phone, area, date & preferred time.',
              },
              {
                n: '3',
                title: 'Send on WhatsApp',
                desc: 'We confirm, share bKash details, and start baking.',
              },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream font-display text-xl text-olive-dark">
                  {step.n}
                </div>

                <h3 className="mt-4 font-display text-xl">
                  {step.title}
                </h3>

                <p className="mt-1 text-sm text-cream/80">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CURVED DIVIDER */}
      <div className="relative h-12 w-full bg-cream md:h-24">
        <svg
          className="absolute top-0 h-full w-full rotate-180 text-olive"
          preserveAspectRatio="none"
          viewBox="0 0 1440 74"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M0 74H1440V35.0345C1440 35.0345 1224 0 720 0C216 0 0 35.0345 0 35.0345V74Z" />
        </svg>
      </div>

      {/* ORDER TRACKING */}
      <TrackOrderWidget />

      {/* DELIVERY, PICKUP & SUPPORT */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
            <div className="text-2xl">🚚</div>

            <h3 className="mt-3 font-display text-lg text-ink">
              Delivery across Chittagong
            </h3>

            <p className="mt-1 text-sm text-olive-dark">
              We deliver to all areas within Chittagong city.
              Delivery fee confirmed on WhatsApp.
            </p>
          </div>

          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
            <div className="text-2xl">📍</div>

            <h3 className="mt-3 font-display text-lg text-ink">
              Or pick up
            </h3>

            <p className="mt-1 text-sm text-olive-dark">
              Sanmar Ocean City / 2 No Gate / Women College Mor,
              Chittagong.
            </p>
          </div>

          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
            <div className="text-2xl">💬</div>

            <h3 className="mt-3 font-display text-lg text-ink">
              Questions? Message us.
            </h3>

            <p className="mt-1 text-sm text-olive-dark">
              Tap the WhatsApp button any time — we reply within
              minutes during shop hours.
            </p>
          </div>
        </div>
      </section>
    
    
      {/* INSTAGRAM GRID */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="mb-2 font-display text-3xl text-ink">
            Follow our journey
          </h2>

          <a
            href="https://www.instagram.com/_cakesbyaspeya_/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-burgundy hover:underline"
          >
            @_cakesbyaspeya_
          </a>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <a
              key={i}
              href="https://www.instagram.com/_cakesbyaspeya_/?hl=en"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit Cakes by Aspeya on Instagram — post ${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-cream-dark"
            >
              {/* Replace with your actual Instagram image URLs */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
                            {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={`https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop&sig=${i}`} 
                alt="Instagram post" 
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <img
                src={`https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop&sig=${i}`}
                alt={`Cake inspiration ${i}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-ink/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-2xl text-cream">📸</span>
              </div>
            </a>
          ))}
        </div>
      </section>

    
    </div>
  );
}
