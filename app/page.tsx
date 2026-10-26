import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { AnnouncementBar } from '@/components\home\AnnouncementBar';
import { HeroSlider } from '@/components/home/HeroSlider';

const WHATSAPP_URL =
  'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

const INSTAGRAM_URL =
  'https://www.instagram.com/_cakesbyaspeya_/?hl=en';

const INSTAGRAM_IMAGES = [
  'photo-1578985545062-69928b1d9587',
  'photo-1535254973040-607b474cb50d',
  'photo-1563729784474-d77dbb933a9e',
  'photo-1578985545062-69928b1d9587',
  'photo-1557925923-cd4648e211a0',
  'photo-1588195538326-c5b1e9f80a1b',
];

const ORDER_STEPS = [
  {
    number: '01',
    title: 'Choose your favourite',
    description:
      'Explore our cakes and desserts, or share your dream cake design with us.',
    icon: '♡',
  },
  {
    number: '02',
    title: 'Make it yours',
    description:
      'Select your flavour, size and design. We will confirm the price and details.',
    icon: '✳',
  },
  {
    number: '03',
    title: 'Let us bake',
    description:
      'Confirm your order and get ready for a delicious moment made just for you.',
    icon: '✧',
  },
];

export default async function HomePage() {
  const [cakes, desserts] = await Promise.all([
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const heroSlides = cakes
    .filter((cake) => cake.images?.length > 0)
    .slice(0, 5)
    .map((cake) => ({ image: cake.images[0], title: 'Your moment. Your cake.' }));

  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 6);

  return (
    <main className="overflow-hidden bg-cream text-ink">
      <AnnouncementBar />
      {/* HERO */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-16 lg:px-8">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-burgundy/5 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-olive/10 blur-3xl"
        />

        <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
          {/* Hero content */}
          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-white/70 px-4 py-2 text-xs font-medium tracking-wide text-burgundy shadow-sm backdrop-blur-sm sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-burgundy" />
              Baked with love in Chattogram
            </div>

            <h1 className="mt-6 max-w-xl font-display text-5xl leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              A little sweetness,
              <span className="mt-2 block italic text-burgundy">
                a lot of love.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-olive-dark sm:text-lg">
              From dreamy custom cakes to irresistible desserts, we
              create sweet moments that make every celebration
              unforgettable.
            </p>

            <p className="mt-3 text-sm text-olive-dark/75">
              Made to order · Minimum 24 hours advance notice
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/cakes"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-burgundy px-7 py-4 text-sm font-semibold text-cream shadow-lg shadow-burgundy/15 transition-all duration-300 hover:-translate-y-1 hover:bg-burgundy-dark hover:shadow-xl"
              >
                Explore our cakes
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-olive/30 bg-white/60 px-7 py-4 text-sm font-semibold text-olive-dark transition-all duration-300 hover:-translate-y-1 hover:border-olive hover:bg-olive hover:text-cream"
              >
                <span aria-hidden="true">↗</span>
                Order on WhatsApp
              </a>
            </div>

            {/* Quick highlights */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-olive/15 pt-6 text-xs text-olive-dark sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Custom designs
              </span>
              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Freshly made
              </span>
              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Made for your moments
              </span>
            </div>
          </div>

          {/* Dynamic hero image carousel */}
          <HeroSlider slides={heroSlides} />
        </div>
      </section>

      {/* QUICK CATEGORY LINKS */}
      <section className="border-y border-olive/10 bg-white/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-olive/10 px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {[
            {
              title: 'Celebration Cakes',
              subtitle: 'Make it memorable',
              href: '/cakes',
              symbol: '♡',
            },
            {
              title: 'Dessert Collection',
              subtitle: 'Little bites of joy',
              href: '/desserts',
              symbol: '✧',
            },
            {
              title: 'Custom Designs',
              subtitle: 'Your idea, our craft',
              href: '/cakes',
              symbol: '✳',
            },
            {
              title: 'Track Your Order',
              subtitle: 'Stay in the loop',
              href: '#track-order',
              symbol: '↗',
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex items-center gap-3 px-3 py-5 transition-colors duration-300 hover:bg-burgundy/5 sm:gap-4 sm:px-5 sm:py-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy/10 font-display text-2xl text-burgundy transition-all duration-300 group-hover:rotate-6 group-hover:bg-burgundy group-hover:text-cream">
                {item.symbol}
              </span>
              <span>
                <span className="block text-sm font-semibold text-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs text-olive-dark/75">
                  {item.subtitle}
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-18 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
            Made for every moment
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            What are we celebrating?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
            From little surprises to milestone celebrations, find a cake for your moment.
          </p>
        </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { title: 'Birthdays', subtitle: 'Make a wish', symbol: '🎂', slug: 'birthdays' },
            { title: 'Anniversaries', subtitle: 'Celebrate together', symbol: '♡', slug: 'anniversaries' },
            { title: 'Kids’ Parties', subtitle: 'Big smiles, sweet bites', symbol: '✦', slug: 'kids-parties' },
            { title: 'Just Because', subtitle: 'A little everyday joy', symbol: '✧', slug: 'just-because' },
          ].map((occasion, index) => (
            <Link
              key={occasion.title}
              href={`/occasions/${occasion.slug}`} // 👈 Dynamically routes to the new pages
              className="group relative isolate overflow-hidden rounded-3xl border border-olive/10 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/20 hover:shadow-xl hover:shadow-olive/10 sm:p-7"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <span className="absolute -right-3 -top-5 -z-10 text-7xl text-burgundy/5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">
                {occasion.symbol}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-burgundy/10 text-xl text-burgundy transition-all duration-300 group-hover:bg-burgundy group-hover:text-cream">
                {occasion.symbol}
              </span>
              <h3 className="mt-5 font-display text-xl text-ink sm:text-2xl">
                {occasion.title}
              </h3>
              <p className="mt-2 text-sm text-olive-dark/75">{occasion.subtitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-burgundy transition-all group-hover:gap-3">
                Explore cakes <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED CAKES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              Baked for your happiness
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              Cakes to fall in love with
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
              Thoughtfully crafted cakes for birthdays, celebrations
              and all the little moments worth celebrating.
            </p>
          </div>

          <Link
            href="/cakes"
            className="group hidden shrink-0 items-center gap-2 pb-1 text-sm font-semibold text-burgundy transition-all hover:gap-3 sm:inline-flex"
          >
            View all cakes <span>→</span>
          </Link>
        </div>

        {featuredCakes.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {featuredCakes.map((product) => (
              <div
                key={product.slug}
                className="min-w-0 transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-olive/20 bg-white/50 px-5 py-12 text-center">
            <p className="font-display text-2xl text-ink">
              Something sweet is coming
            </p>
            <p className="mt-2 text-sm text-olive-dark">
              Our cake collection will appear here soon.
            </p>
          </div>
        )}

        <Link
          href="/cakes"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-burgundy/25 px-5 py-3 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:hidden"
        >
          Explore all cakes <span>→</span>
        </Link>
      </section>

      {/* CUSTOM CAKE CALLOUT */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative overflow-hidden rounded-[2rem] bg-burgundy px-6 py-10 text-cream sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div
            aria-hidden="true"
            className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110 sm:h-80 sm:w-80"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-2xl"
          />

          <div className="relative grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/70">
                Dream it. We bake it.
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                Have a cake design in mind?
                <span className="block italic text-cream/75">
                  Let&apos;s make it yours.
                </span>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-cream/80 sm:text-base">
                Share your inspiration, choose your flavour and tell
                us about your celebration. We&apos;ll help you bring
                your dream cake to life.
              </p>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/button inline-flex w-fit items-center justify-center gap-3 rounded-full bg-cream px-6 py-4 text-sm font-semibold text-burgundy transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              Discuss your design
              <span className="transition-transform group-hover/button:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* DESSERTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              A little treat goes a long way
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              Something sweet
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
              Discover delightful desserts for your celebrations
              or your everyday sweet cravings.
            </p>
          </div>

          <Link
            href="/desserts"
            className="group hidden shrink-0 items-center gap-2 pb-1 text-sm font-semibold text-burgundy transition-all hover:gap-3 sm:inline-flex"
          >
            All desserts <span>→</span>
          </Link>
        </div>

        {featuredDesserts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
            {featuredDesserts.map((product) => (
              <div
                key={product.slug}
                className="min-w-0 transition-transform duration-300 hover:-translate-y-1"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-olive/20 bg-white/50 px-5 py-12 text-center">
            <p className="font-display text-2xl text-ink">
              Sweet treats are on their way
            </p>
            <p className="mt-2 text-sm text-olive-dark">
              Our dessert collection will appear here soon.
            </p>
          </div>
        )}

        <Link
          href="/desserts"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-burgundy/25 px-5 py-3 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:hidden"
        >
          Discover all desserts <span>→</span>
        </Link>
      </section>

      {/* RECENTLY VIEWED */}
      <RecentlyViewed />

      {/* HOW TO ORDER */}
      <section className="relative overflow-hidden bg-olive py-16 text-cream md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cream/65">
              Simple, personal, delicious
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
              Your sweet moment starts here
            </h2>
            <p className="mt-4 text-sm leading-7 text-cream/75 sm:text-base">
              Ordering your favourite cake is easy. Here&apos;s how
              we turn your idea into something special.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-6">
            {ORDER_STEPS.map((step) => (
              <div
                key={step.number}
                className="group rounded-3xl border border-white/15 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.08] sm:p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-4xl text-cream/25">
                    {step.number}
                  </span>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream text-2xl text-olive transition-transform duration-300 group-hover:rotate-12">
                    {step.icon}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-cream/75">
                  {step.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-semibold text-olive transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
            >
              Start your order <span>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* ORDER TRACKING */}
      <section id="track-order" className="scroll-mt-24">
        <TrackOrderWidget />
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
            Follow the sweetness
          </p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            A peek into our world
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-7 text-olive-dark">
            Discover our creations, behind-the-scenes moments and
            the little details that make every cake special.
          </p>

          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-white/60 px-5 py-3 text-sm font-semibold text-burgundy transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy hover:bg-burgundy hover:text-cream"
          >
            <span aria-hidden="true">◎</span>
            @_cakesbyaspeya_
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {INSTAGRAM_IMAGES.map((image, index) => (
            <a
              key={`${image}-${index}`}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Explore Cakes by Aspeya on Instagram, gallery image ${index + 1}`}
              className="group relative aspect-square overflow-hidden rounded-2xl bg-cream-dark"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=500&q=80`}
                alt={`Cake and dessert inspiration ${index + 1}`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              <div className="absolute inset-0 flex items-center justify-center bg-burgundy/0 transition-colors duration-300 group-hover:bg-burgundy/45">
                <span className="translate-y-3 rounded-full border border-white/50 px-4 py-2 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View Instagram ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-4 text-center text-xs text-olive-dark/65">
          Follow us for more sweet inspiration.
        </p>
      </section>

      {/* DELIVERY, PICKUP & SUPPORT */}
      <section className="border-t border-olive/10 bg-white/35 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              Here for your celebrations
            </p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              Made with care, delivered with love
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                icon: '↗',
                title: 'City delivery',
                description:
                  'We deliver within Chattogram city. Delivery charges are confirmed with your order.',
              },
              {
                icon: '⌖',
                title: 'Pickup options',
                description:
                  'Pickup arrangements can be discussed for Sanmar Ocean City, 2 No Gate or Women College Mor, Chattogram.',
              },
              {
                icon: '♡',
                title: 'Personal support',
                description:
                  'Have questions about flavours, designs or your order? Message us on WhatsApp.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-olive/10 bg-white/75 p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/20 hover:shadow-xl hover:shadow-olive/5 sm:p-8"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy/10 font-display text-3xl text-burgundy transition-all duration-300 group-hover:bg-burgundy group-hover:text-cream">
                  {item.icon}
                </span>
                <h3 className="mt-5 font-display text-2xl text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-olive-dark">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-burgundy/10 bg-gradient-to-br from-cream-dark via-white to-burgundy/5 px-6 py-12 text-center sm:px-10 sm:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-20 h-48 w-48 rounded-full bg-burgundy/5 blur-2xl"
          />

          <div className="relative">
            <span className="text-3xl text-burgundy">✧</span>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
              Every celebration deserves something sweet.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-olive-dark sm:text-base">
              Let&apos;s create something delicious for your next
              special moment.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/cakes"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-burgundy px-7 py-4 text-sm font-semibold text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-burgundy-dark hover:shadow-lg"
              >
                Find your cake <span>→</span>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-olive/25 bg-white/70 px-7 py-4 text-sm font-semibold text-olive-dark transition-all duration-300 hover:-translate-y-1 hover:bg-olive hover:text-cream"
              >
                Talk to us <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}