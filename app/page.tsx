import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { HeroSlider } from '@/components/home/HeroSlider';
import { createServerClient } from '@/lib/supabase/server';

const WHATSAPP_URL =
  'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

const INSTAGRAM_URL =
  'https://www.instagram.com/_cakesbyaspeya_/?hl=en';

const INSTAGRAM_IMAGES = [
  'photo-1578985545062-69928b1d9587',
  'photo-1535254973040-607b474cb50d',
  'photo-1563729784474-d77dbb933a9e',
  'photo-1557925923-cd4648e211a0',
  'photo-1588195538326-c5b1e9f80a1b',
  'photo-1578985545062-69928b1d9587',
];

const ORDER_STEPS = [
  {
    number: '01',
    title: 'Explore your options',
    description:
      'Browse our collections or send us a reference photo of your desired cake.',
    icon: '♡',
  },
  {
    number: '02',
    title: 'Personalise your order',
    description:
      'Choose your flavour, size and design. We will confirm the price and details.',
    icon: '✳',
  },
  {
    number: '03',
    title: 'Confirm and enjoy',
    description:
      'Once your order is confirmed, we will prepare your creation for the agreed date.',
    icon: '✧',
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export default async function HomePage() {
  const sb = await createServerClient();

  const [occasionsRes, cakes, desserts] = await Promise.all([
    sb
      .from('occasions')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const occasions = occasionsRes.data || [];

  const allImages = [
    ...cakes.flatMap((cake) => cake.images || []),
    ...desserts.flatMap((dessert) => dessert.images || []),
  ].filter(Boolean);

  const heroSlides = shuffleArray(allImages)
    .slice(0, 10)
    .map((image) => ({
      image,
      title: 'Made for your moments.',
    }));

  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 6);

  const categories = [
    {
      title: 'Celebration Cakes',
      subtitle: 'For moments worth marking',
      href: '/cakes',
      symbol: '♡',
    },
    {
      title: 'Dessert Collection',
      subtitle: 'Your next favourite treat',
      href: '/desserts',
      symbol: '✧',
    },
    {
      title: 'Custom Creations',
      subtitle: 'Designed around your ideas',
      href: '#custom-designs',
      symbol: '✳',
    },
    {
      title: 'Track Your Order',
      subtitle: 'Check your order status',
      href: '#track-order',
      symbol: '↗',
    },
  ];

  const serviceOptions = [
    {
      icon: '↗',
      title: 'Chattogram delivery',
      description:
        'Delivery is available within Chattogram city. Charges will be confirmed when your order is finalised.',
    },
    {
      icon: '⌖',
      title: 'Pickup arrangements',
      description:
        'Discuss pickup options at Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram.',
    },
    {
      icon: '♡',
      title: 'Here to help',
      description:
        'Need help choosing a flavour, planning a design or checking an order? Contact us on WhatsApp.',
    },
  ];

  return (
    <main className="overflow-hidden bg-cream text-ink">

      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 pb-14 pt-10 sm:px-6 md:pb-20 md:pt-16 lg:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-burgundy/5 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-olive/10 blur-3xl"
        />

        <div className="relative grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">

          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <div className="inline-flex items-center gap-2 rounded-full border border-burgundy/15 bg-white/70 px-4 py-2 text-xs font-medium tracking-wide text-burgundy shadow-sm backdrop-blur-sm sm:text-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-burgundy" />
              Baked fresh in Chattogram
            </div>

            <h1 className="mt-6 max-w-xl font-display text-5xl leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              Small details,
              <span className="mt-2 block italic text-burgundy">
                beautifully baked.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-olive-dark sm:text-lg">
              From elegant celebration cakes to delightful desserts,
              discover handcrafted creations designed to make your
              occasions memorable.
            </p>

            <p className="mt-3 text-sm text-olive-dark/75">
              Freshly prepared · Made to order
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/cakes"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-burgundy px-7 py-4 text-sm font-semibold text-cream shadow-lg shadow-burgundy/15 transition-all duration-300 hover:-translate-y-1 hover:bg-burgundy-dark hover:shadow-xl"
              >
                Explore our collection
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
                Order via WhatsApp
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-olive/15 pt-6 text-xs text-olive-dark sm:text-sm">
              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Custom-made designs
              </span>

              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Freshly prepared
              </span>

              <span className="flex items-center gap-2">
                <span className="text-burgundy">✦</span>
                Made for your moments
              </span>
            </div>
          </div>

          <HeroSlider slides={heroSlides} />
        </div>
      </section>

      {/* QUICK CATEGORY LINKS */}
      <section className="border-y border-olive/10 bg-white/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-olive/10 px-4 sm:px-6 md:grid-cols-4 md:divide-y-0 lg:px-8">
          {categories.map((item) => (
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
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
            Celebrate in style
          </p>

          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            Every occasion has its cake
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
            From birthdays and anniversaries to thoughtful surprises,
            find a design that suits your celebration.
          </p>
        </div>

        {occasions.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {occasions.map((occasion, index) => (
              <Link
                key={occasion.slug}
                href={`/occasions/${occasion.slug}`}
                className="group relative isolate overflow-hidden rounded-3xl border border-olive/10 bg-white/70 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-burgundy/20 hover:shadow-xl hover:shadow-olive/10 sm:p-7"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {occasion.image_url && (
                  <>
                    <Image
                      src={occasion.image_url}
                      alt={occasion.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="-z-20 object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
                  </>
                )}

                {!occasion.image_url && (
                  <span className="absolute -right-3 -top-5 -z-10 text-7xl text-burgundy/5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">
                    {occasion.symbol}
                  </span>
                )}

                <span className={`flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all duration-300 ${
                  occasion.image_url
                    ? 'bg-white/20 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-burgundy'
                    : 'bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-cream'
                }`}>
                  {occasion.symbol}
                </span>

                <h3
                  className={`mt-5 font-display text-xl sm:text-2xl ${
                    occasion.image_url ? 'text-white' : 'text-ink'
                  }`}
                >
                  {occasion.title}
                </h3>

                <p
                  className={`mt-2 text-sm ${
                    occasion.image_url
                      ? 'text-white/80'
                      : 'text-olive-dark/75'
                  }`}
                >
                  {occasion.subtitle}
                </p>

                <span
                  className={`mt-5 inline-flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3 ${
                    occasion.image_url ? 'text-white' : 'text-burgundy'
                  }`}
                >
                  Discover designs <span aria-hidden="true">→</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-olive/20 bg-white/50 px-5 py-12 text-center">
            <p className="font-display text-2xl text-ink">
              Find your perfect occasion cake
            </p>
            <p className="mt-2 text-sm text-olive-dark">
              Browse our cake collection to explore available designs.
            </p>
            <Link
              href="/cakes"
              className="mt-5 inline-flex rounded-full bg-burgundy px-6 py-3 text-sm font-semibold text-cream transition hover:bg-burgundy-dark"
            >
              Browse cakes →
            </Link>
          </div>
        )}
      </section>

      {/* FEATURED CAKES */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              Crafted for the occasion
            </p>

            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              Meet your next favourite cake
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
              Explore beautifully finished cakes with delicious
              flavours and designs suited to birthdays, milestones
              and gatherings.
            </p>
          </div>

          <Link
            href="/cakes"
            className="group hidden shrink-0 items-center gap-2 pb-1 text-sm font-semibold text-burgundy transition-all hover:gap-3 sm:inline-flex"
          >
            Browse all cakes <span>→</span>
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
              Something wonderful is in the making
            </p>

            <p className="mt-2 text-sm text-olive-dark">
              Our latest cake creations will be available here soon.
            </p>
          </div>
        )}

        <Link
          href="/cakes"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-burgundy/25 px-5 py-3 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:hidden"
        >
          Explore our cakes <span>→</span>
        </Link>
      </section>

      {/* CUSTOM CAKE SECTION */}
      <section
        id="custom-designs"
        className="mx-auto scroll-mt-24 max-w-7xl px-4 sm:px-6 lg:px-8"
      >
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
                Your vision, our craftsmanship
              </p>

              <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                Imagine your perfect cake.
                <span className="block italic text-cream/75">
                  We&apos;ll bring it to life.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-cream/80 sm:text-base">
                Share your inspiration, choose your preferred flavour
                and tell us about your occasion. We&apos;ll work with
                you to create a cake that reflects your vision.
              </p>
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/button inline-flex w-fit items-center justify-center gap-3 rounded-full bg-cream px-6 py-4 text-sm font-semibold text-burgundy transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-xl"
            >
              Create your custom cake
              <span className="transition-transform group-hover/button:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* FEATURED DESSERTS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4 md:mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              A collection of irresistible treats
            </p>

            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
              Beyond the cake
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
              From creamy indulgences to bite-sized delights,
              explore desserts made for sharing, gifting or enjoying
              yourself.
            </p>
          </div>

          <Link
            href="/desserts"
            className="group hidden shrink-0 items-center gap-2 pb-1 text-sm font-semibold text-burgundy transition-all hover:gap-3 sm:inline-flex"
          >
            Browse desserts <span>→</span>
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
              Delicious treats are coming soon
            </p>

            <p className="mt-2 text-sm text-olive-dark">
              Check back to discover our dessert selection.
            </p>
          </div>
        )}

        <Link
          href="/desserts"
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-burgundy/25 px-5 py-3 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:hidden"
        >
          Explore all desserts <span>→</span>
        </Link>
      </section>

      {/* RECENTLY VIEWED PRODUCTS */}
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
              Three simple steps
            </p>

            <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
              From your idea to your table
            </h2>

            <p className="mt-4 text-sm leading-7 text-cream/75 sm:text-base">
              Ordering is simple. Choose a favourite, personalise
              your selection and let us take care of the baking.
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
              Place your order <span>→</span>
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
            Fresh from our kitchen
          </p>

          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl md:text-5xl">
            A closer look at our creations
          </h2>

          <p className="mt-3 max-w-lg text-sm leading-7 text-olive-dark">
            Browse our cake designs, explore new flavours and get
            inspiration for your next celebration.
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
          Follow along for new designs and behind-the-scenes updates.
        </p>
      </section>

      {/* DELIVERY, PICKUP AND SUPPORT */}
      <section className="border-t border-olive/10 bg-white/35 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-burgundy">
              Convenient ordering
            </p>

            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
              From our kitchen to your celebration
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {serviceOptions.map((item) => (
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
              Make your next celebration unforgettable.
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-olive-dark sm:text-base">
              Find the perfect cake or dessert to complete your occasion.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/cakes"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-burgundy px-7 py-4 text-sm font-semibold text-cream transition-all duration-300 hover:-translate-y-1 hover:bg-burgundy-dark hover:shadow-lg"
              >
                Explore our cakes <span>→</span>
              </Link>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-olive/25 bg-white/70 px-7 py-4 text-sm font-semibold text-olive-dark transition-all duration-300 hover:-translate-y-1 hover:bg-olive hover:text-cream"
              >
                Get in touch <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}