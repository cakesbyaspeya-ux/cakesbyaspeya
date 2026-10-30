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

const INSTAGRAM_URL = 'https://www.instagram.com/_cakesbyaspeya_/?hl=en';

const INSTAGRAM_IMAGES = [
  'photo-1578985545062-69928b1d9587',
  'photo-1535254973040-607b474cb50d',
  'photo-1563729784474-d77dbb933a9e',
  'photo-1557925923-cd4648e211a0',
  'photo-1588195538326-c5b1e9f80a1b',
  'photo-1464349095431-e9a21285b5f3',
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

const TRUST_ITEMS = [
  { icon: '✦', title: 'Made to order', text: 'Baked fresh for your date' },
  { icon: '❀', title: 'Custom designs', text: 'Your idea, beautifully finished' },
  { icon: '↗', title: 'Chattogram delivery', text: 'Right to your door' },
  { icon: '♡', title: 'WhatsApp support', text: 'Quick, friendly help' },
];

const MARQUEE_WORDS = [
  'Birthday cakes',
  'Anniversary cakes',
  'Custom designs',
  'Delightful desserts',
  'Made to order',
  'Gifts & surprises',
  'Celebration cakes',
];

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse our collection or send us a reference photo on WhatsApp. We will confirm your flavour, size, design and price before anything is prepared.',
  },
  {
    q: 'Can I request a custom design?',
    a: 'Absolutely. Share your inspiration and occasion details with us on WhatsApp and we will work with you to bring your idea to life.',
  },
  {
    q: 'Do you deliver?',
    a: 'Yes, delivery is available within Chattogram city. Delivery charges are confirmed when your order is finalised.',
  },
  {
    q: 'Can I pick up my order?',
    a: 'Yes. Pickup can be arranged at Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram. Message us to agree on the details.',
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

function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <p
        className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-burgundy ${
          center ? 'justify-center' : ''
        }`}
      >
        <span aria-hidden="true" className="h-px w-8 bg-burgundy/40" />
        {eyebrow}
        {center && (
          <span aria-hidden="true" className="h-px w-8 bg-burgundy/40" />
        )}
      </p>

      <h2 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl md:text-5xl">
        {title}
      </h2>

      {text && (
        <p className="mt-3 text-sm leading-7 text-olive-dark sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
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

  const backgroundCakeImages = shuffleArray(
    cakes.flatMap((cake) => cake.images || []).filter(Boolean)
  ).slice(0, 8);

  const collageImages = shuffleArray(allImages).slice(0, 3);

  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 6);

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

  const placements = [
    'left-[-2rem] top-[7%] h-24 w-24 sm:left-[2%] sm:h-36 sm:w-36',
    'right-[-2rem] top-[18%] h-28 w-28 sm:right-[3%] sm:h-40 sm:w-40',
    'left-[4%] top-[38%] h-20 w-20 sm:left-[8%] sm:h-28 sm:w-28',
    'right-[2%] top-[49%] h-24 w-24 sm:right-[7%] sm:h-36 sm:w-36',
    'left-[-2rem] top-[68%] h-28 w-28 sm:left-[3%] sm:h-40 sm:w-40',
    'right-[-2rem] top-[82%] h-24 w-24 sm:right-[4%] sm:h-32 sm:w-32',
    'left-[35%] top-[28%] h-20 w-20 sm:left-[40%] sm:h-28 sm:w-28',
    'right-[32%] top-[72%] h-20 w-20 sm:right-[36%] sm:h-28 sm:w-28',
  ];

  return (
    <main className="relative isolate min-w-0 overflow-x-clip bg-cream text-ink motion-reduce:scroll-auto">
      <style>{`
        @keyframes cakeDrift {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-5deg); }
          50% { transform: translate3d(0, -18px, 0) rotate(5deg); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate3d(0, 24px, 0); }
          to { opacity: 1; transform: translate3d(0, 0, 0); }
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes floaty {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .reveal { animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .marquee-track { animation: marquee 32s linear infinite; }
        .marquee:hover .marquee-track { animation-play-state: paused; }
        .floaty { animation: floaty 6s ease-in-out infinite; }
        .shimmer-text {
          background-size: 200% auto;
          animation: shimmer 6s linear infinite;
        }
        .grain::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.05;
          background-image: radial-gradient(currentColor 1px, transparent 1px);
          background-size: 18px 18px;
        }
        details > summary { list-style: none; }
        details > summary::-webkit-details-marker { display: none; }
        details[open] .faq-icon { transform: rotate(45deg); }
        @media (prefers-reduced-motion: reduce) {
          .cake-background-drift,
          .reveal,
          .marquee-track,
          .floaty,
          .shimmer-text { animation: none !important; }
        }
      `}</style>

      {/* DYNAMIC CAKE PHOTO BACKGROUND */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        {backgroundCakeImages.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className={`cake-background-drift absolute ${placements[index % placements.length]} overflow-hidden rounded-[1.5rem] border border-white/70 opacity-[0.10] shadow-xl sm:rounded-[2rem]`}
            style={{
              animation: `cakeDrift ${12 + (index % 4) * 2}s ease-in-out ${index * -1.7}s infinite`,
            }}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(max-width: 640px) 112px, 160px"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <div className="relative z-10">
        {/* HERO SECTION */}
        <section className="relative mx-auto max-w-7xl px-4 pb-8 pt-7 sm:px-6 sm:pb-12 sm:pt-10 md:pb-16 md:pt-16 lg:px-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-burgundy/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-olive/15 blur-3xl"
          />

          <div className="relative grid min-w-0 grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-8 lg:gap-16">
            <div className="reveal min-w-0 motion-reduce:animate-none">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-burgundy/15 bg-white/80 px-3 py-2 text-[11px] font-medium tracking-wide text-burgundy shadow-sm backdrop-blur-sm sm:px-4 sm:text-sm">
                <span className="h-2 w-2 animate-pulse rounded-full bg-burgundy" />
                Custom Cakes & Delightful Desserts
              </div>

              <h1 className="mt-5 max-w-xl font-display text-[clamp(2.6rem,10vw,3.6rem)] leading-[1.04] tracking-tight text-ink sm:mt-6 sm:text-6xl lg:text-7xl">
                A little sweetness,
                <span className="shimmer-text mt-2 block bg-gradient-to-r from-burgundy via-burgundy-dark to-burgundy bg-clip-text italic text-transparent">
                  a lot of love.
                </span>
              </h1>

              <p className="mt-4 max-w-lg text-sm leading-7 text-olive-dark sm:mt-6 sm:text-lg sm:leading-8">
                From elegant celebration cakes to delightful desserts,
                discover handcrafted creations designed to make your
                occasions memorable.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <Link
                  href="/cakes"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-burgundy px-5 py-3.5 text-sm font-semibold text-cream shadow-lg shadow-burgundy/25 transition-all duration-300 hover:bg-burgundy-dark hover:shadow-xl sm:w-auto sm:px-7 sm:py-4 sm:hover:-translate-y-1"
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
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-olive/30 bg-white/70 px-5 py-3.5 text-sm font-semibold text-olive-dark backdrop-blur-sm transition-all duration-300 hover:border-olive hover:bg-olive hover:text-cream sm:w-auto sm:px-7 sm:py-4 sm:hover:-translate-y-1"
                >
                  <span aria-hidden="true">↗</span>
                  Order via WhatsApp
                </a>
              </div>

              <p className="mt-5 flex items-center gap-2 text-xs text-olive-dark/80 sm:text-sm">
                <span className="text-burgundy">✦</span>
                Freshly prepared · Made to order · Chattogram
              </p>
            </div>

            {/* Slider with decorative frame */}
            <div
              className="reveal relative min-w-0"
              style={{ animationDelay: '150ms' }}
            >
              <div
                aria-hidden="true"
                className="absolute -inset-3 -z-10 rotate-2 rounded-[2.5rem] border border-burgundy/15 bg-gradient-to-br from-burgundy/10 via-transparent to-olive/10 sm:-inset-4"
              />
              <HeroSlider slides={heroSlides} />

              <div className="floaty absolute -bottom-4 left-3 z-10 hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex md:-left-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-burgundy text-lg text-cream">
                  ♡
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    Made with love
                  </p>
                  <p className="text-xs text-olive-dark/75">
                    Every single order
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-olive/10 bg-olive/10 shadow-sm sm:rounded-3xl lg:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 bg-white/80 p-4 backdrop-blur-sm sm:gap-4 sm:p-6"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-burgundy/10 text-lg text-burgundy sm:h-12 sm:w-12 sm:text-xl">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-ink sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-0.5 hidden text-xs text-olive-dark/75 sm:block">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MARQUEE */}
        <div
          aria-hidden="true"
          className="marquee mt-10 overflow-hidden border-y border-burgundy/10 bg-burgundy/[0.04] py-4 sm:mt-14"
        >
          <div className="marquee-track flex w-max gap-10 whitespace-nowrap font-display text-xl italic text-burgundy/70 sm:text-2xl">
            {[...MARQUEE_WORDS, ...MARQUEE_WORDS].map((word, i) => (
              <span key={`${word}-${i}`} className="flex items-center gap-10">
                {word}
                <span className="text-sm not-italic text-burgundy/40">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* SHOP BY OCCASION */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-24 lg:px-8">
          <SectionHeading
            center
            eyebrow="Celebrate in style"
            title="Every occasion has its cake"
            text="From birthdays and anniversaries to thoughtful surprises, find a design that suits your celebration."
          />

          <div className="mt-8 sm:mt-12">
            {occasions.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {occasions.map((occasion, index) => (
                  <Link
                    key={occasion.slug}
                    href={`/occasions/${occasion.slug}`}
                    className="reveal group relative isolate flex min-h-[11rem] min-w-0 flex-col justify-end overflow-hidden rounded-2xl border border-olive/10 bg-white/80 p-4 shadow-sm transition-all duration-500 hover:border-burgundy/20 hover:shadow-2xl hover:shadow-burgundy/10 sm:min-h-[16rem] sm:rounded-3xl sm:p-6 sm:hover:-translate-y-1"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    {occasion.image_url ? (
                      <>
                        <Image
                          src={occasion.image_url}
                          alt={occasion.title}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="-z-20 object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                      </>
                    ) : (
                      <span className="absolute -right-3 -top-5 -z-10 text-8xl text-burgundy/5 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-125">
                        {occasion.symbol}
                      </span>
                    )}

                    <span
                      className={`absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl text-xl transition-all duration-300 sm:left-6 sm:top-6 ${
                        occasion.image_url
                          ? 'bg-white/20 text-white backdrop-blur-sm group-hover:bg-white group-hover:text-burgundy'
                          : 'bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-cream'
                      }`}
                    >
                      {occasion.symbol}
                    </span>

                    <h3
                      className={`break-words font-display text-lg leading-tight sm:text-2xl ${
                        occasion.image_url ? 'text-white' : 'text-ink'
                      }`}
                    >
                      {occasion.title}
                    </h3>

                    <p
                      className={`mt-1.5 line-clamp-2 text-xs sm:text-sm ${
                        occasion.image_url
                          ? 'text-white/80'
                          : 'text-olive-dark/75'
                      }`}
                    >
                      {occasion.subtitle}
                    </p>

                    <span
                      className={`mt-3 inline-flex items-center gap-2 text-xs font-semibold transition-all sm:text-sm sm:group-hover:gap-3 ${
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
          </div>
        </section>

        {/* FEATURED CAKES */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-20 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
            <SectionHeading
              eyebrow="Crafted for the occasion"
              title="Meet your next favourite cake"
              text="Explore beautifully finished cakes with delicious flavours and designs suited to birthdays, milestones and gatherings."
            />

            <Link
              href="/cakes"
              className="group hidden shrink-0 items-center gap-2 rounded-full border border-burgundy/25 px-5 py-2.5 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:inline-flex"
            >
              Browse all cakes
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {featuredCakes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
              {featuredCakes.map((product, index) => (
                <div
                  key={product.slug}
                  className="reveal min-w-0 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ animationDelay: `${index * 90}ms` }}
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
          className="mx-auto scroll-mt-24 max-w-7xl px-4 py-6 sm:px-6 lg:px-8"
        >
          <div className="grain group relative overflow-hidden rounded-3xl bg-gradient-to-br from-burgundy via-burgundy to-burgundy-dark px-5 py-10 text-cream sm:rounded-[2.5rem] sm:px-10 sm:py-16 lg:px-16">
            <div
              aria-hidden="true"
              className="absolute -right-12 -top-20 h-64 w-64 rounded-full border border-white/10 transition-transform duration-700 group-hover:scale-110 sm:h-96 sm:w-96"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-white/5 blur-2xl"
            />

            <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-12">
              <div>
                <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-cream/70">
                  <span aria-hidden="true" className="h-px w-8 bg-cream/40" />
                  Your vision, our craftsmanship
                </p>

                <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight sm:text-4xl md:text-5xl">
                  Imagine your perfect cake.
                  <span className="block italic text-cream/75">
                    We&apos;ll bring it to life.
                  </span>
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-7 text-cream/80 sm:text-base">
                  Share your inspiration, choose your preferred flavour and
                  tell us about your occasion. We&apos;ll work with you to
                  create a cake that reflects your vision.
                </p>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/button mt-7 inline-flex w-fit items-center justify-center gap-3 rounded-full bg-cream px-6 py-4 text-sm font-semibold text-burgundy shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
                >
                  Create your custom cake
                  <span className="transition-transform group-hover/button:translate-x-1">
                    →
                  </span>
                </a>
              </div>

              {collageImages.length >= 3 && (
                <div
                  aria-hidden="true"
                  className="relative mx-auto hidden h-72 w-full max-w-sm sm:block md:h-80"
                >
                  <div className="absolute left-0 top-6 h-44 w-36 -rotate-6 overflow-hidden rounded-3xl border-4 border-cream/90 shadow-2xl transition-transform duration-500 group-hover:-rotate-12 md:h-52 md:w-40">
                    <Image
                      src={collageImages[0]}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute right-0 top-0 h-52 w-40 rotate-6 overflow-hidden rounded-3xl border-4 border-cream/90 shadow-2xl transition-transform duration-500 group-hover:rotate-12 md:h-60 md:w-44">
                    <Image
                      src={collageImages[1]}
                      alt=""
                      fill
                      sizes="176px"
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 overflow-hidden rounded-full border-4 border-cream/90 shadow-2xl">
                    <Image
                      src={collageImages[2]}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURED DESSERTS */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-20 lg:px-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end md:mb-12">
            <SectionHeading
              eyebrow="A collection of irresistible treats"
              title="Beyond the cake"
              text="From creamy indulgences to bite-sized delights, explore desserts made for sharing, gifting or enjoying yourself."
            />

            <Link
              href="/desserts"
              className="group hidden shrink-0 items-center gap-2 rounded-full border border-burgundy/25 px-5 py-2.5 text-sm font-semibold text-burgundy transition-all hover:bg-burgundy hover:text-cream sm:inline-flex"
            >
              Browse desserts
              <span className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {featuredDesserts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-6 lg:gap-5">
              {featuredDesserts.map((product, index) => (
                <div
                  key={product.slug}
                  className="reveal min-w-0 transition-transform duration-300 hover:-translate-y-1.5"
                  style={{ animationDelay: `${index * 70}ms` }}
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
        <section className="grain relative mt-8 overflow-hidden bg-olive py-14 text-cream sm:py-20 md:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/5 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-black/10 blur-3xl"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-cream/65">
                <span aria-hidden="true" className="h-px w-8 bg-cream/30" />
                Three simple steps
                <span aria-hidden="true" className="h-px w-8 bg-cream/30" />
              </p>

              <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl">
                From your idea to your table
              </h2>

              <p className="mt-4 text-sm leading-7 text-cream/75 sm:text-base">
                Ordering is simple. Choose a favourite, personalise your
                selection and let us take care of the baking.
              </p>
            </div>

            <div className="relative mt-10 grid gap-4 sm:mt-14 md:grid-cols-3 md:gap-6">
              <div
                aria-hidden="true"
                className="absolute left-[16%] right-[16%] top-[3.25rem] hidden border-t border-dashed border-white/25 md:block"
              />

              {ORDER_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="group relative rounded-2xl border border-white/15 bg-white/[0.05] p-5 backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/[0.10] sm:rounded-3xl sm:p-8 sm:hover:-translate-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-5xl text-cream/20">
                      {step.number}
                    </span>

                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream text-2xl text-olive shadow-lg transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                      {step.icon}
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl">{step.title}</h3>

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
                className="inline-flex items-center justify-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-semibold text-olive shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl"
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
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 md:py-20 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <SectionHeading
              center
              eyebrow="Fresh from our kitchen"
              title="A closer look at our creations"
              text="Browse our cake designs, explore new flavours and get inspiration for your next celebration."
            />

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-burgundy/20 bg-white/70 px-5 py-3 text-sm font-semibold text-burgundy transition-all duration-300 hover:-translate-y-0.5 hover:border-burgundy hover:bg-burgundy hover:text-cream"
            >
              <span aria-hidden="true">◎</span>
              @_cakesbyaspeya_
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-2.5 sm:mt-10 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
            {INSTAGRAM_IMAGES.map((image, index) => (
              <a
                key={`${image}-${index}`}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Explore Cakes by Aspeya on Instagram, gallery image ${index + 1}`}
                className={`group relative aspect-square min-w-0 overflow-hidden rounded-xl bg-cream-dark shadow-sm sm:rounded-2xl ${
                  index % 2 === 1 ? 'lg:translate-y-4' : ''
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=500&q=80`}
                  alt={`Cake and dessert inspiration ${index + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover sm:transition-transform sm:duration-700 sm:ease-out sm:group-hover:scale-110"
                />

                <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-burgundy/0 transition-colors duration-300 sm:group-hover:bg-burgundy/45">
                  <span className="translate-y-3 rounded-full border border-white/50 px-4 py-2 text-xs font-medium text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    View Instagram ↗
                  </span>
                </div>
              </a>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-olive-dark/65 lg:mt-10">
            Follow along for new designs and behind-the-scenes updates.
          </p>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <SectionHeading
            center
            eyebrow="Good to know"
            title="Questions, answered"
          />

          <div className="mt-8 space-y-3 sm:mt-10">
            {FAQS.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-olive/10 bg-white/75 px-5 py-4 shadow-sm transition-colors open:border-burgundy/20 open:bg-white sm:px-6"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-lg text-ink sm:text-xl">
                  {item.q}
                  <span
                    aria-hidden="true"
                    className="faq-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-burgundy/10 text-xl leading-none text-burgundy transition-transform duration-300"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-olive-dark">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* DELIVERY, PICKUP AND SUPPORT */}
        <section className="border-t border-olive/10 bg-white/40 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
              <SectionHeading
                center
                eyebrow="Convenient ordering"
                title="From our kitchen to your celebration"
              />
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
              {serviceOptions.map((item) => (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-olive/10 bg-white/80 p-5 shadow-sm transition-all duration-300 hover:border-burgundy/20 hover:shadow-xl hover:shadow-burgundy/5 sm:rounded-3xl sm:p-8 sm:hover:-translate-y-1"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-burgundy/10 font-display text-3xl text-burgundy transition-all duration-300 group-hover:rotate-6 group-hover:bg-burgundy group-hover:text-cream">
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
      </div>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order via WhatsApp"
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-burgundy px-4 py-3 text-sm font-semibold text-cream shadow-xl shadow-burgundy/30 transition-all duration-300 hover:-translate-y-1 hover:bg-burgundy-dark sm:bottom-6 sm:right-6 sm:px-5"
      >
        <span aria-hidden="true">↗</span>
        <span className="hidden sm:inline">Order on WhatsApp</span>
        <span className="sm:hidden">Order</span>
      </a>
    </main>
  );
}
