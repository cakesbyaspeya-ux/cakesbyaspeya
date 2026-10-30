import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';
import { createServerClient } from '@/lib/supabase/server';

const WHATSAPP_URL =
  'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

const FAQS = [
  {
    q: 'How do I place an order?',
    a: 'Browse our collection or send us a reference photo on WhatsApp. We will confirm your flavour, size, design and price before anything is prepared.',
  },
  {
    q: 'Can I request a custom design?',
    a: 'Yes. Share your inspiration and occasion details with us on WhatsApp and we will discuss your design.',
  },
  {
    q: 'Do you deliver?',
    a: 'Delivery is available within Chattogram city. Delivery charges are confirmed when your order is finalised.',
  },
  {
    q: 'Can I pick up my order?',
    a: 'Pickup can be arranged at Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram. Please message us to agree on the details.',
  },
];

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {text && (
        <p className="mt-3 max-w-xl text-sm leading-7 text-olive-dark sm:text-base">
          {text}
        </p>
      )}
    </div>
  );
}

function CollectionCard({
  title,
  description,
  href,
  image,
  label,
}: {
  title: string;
  description: string;
  href: string;
  image?: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="group relative isolate flex min-h-[250px] overflow-hidden rounded-3xl bg-olive-dark p-6 text-white sm:min-h-[340px] sm:p-8"
    >
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="-z-20 object-cover"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />
      <div className="mt-auto max-w-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
          {label}
        </p>
        <h3 className="mt-2 font-display text-3xl sm:text-4xl">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-white/85">{description}</p>
        <span className="mt-5 inline-flex rounded-full bg-cream px-5 py-3 text-sm font-semibold text-burgundy">
          Explore collection <span className="ml-2">→</span>
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const sb = await createServerClient();

  const [occasionsRes, cakes, desserts] = await Promise.all([
    sb.from('occasions').select('*').eq('is_active', true).order('sort_order'),
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const occasions = occasionsRes.data || [];
  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 4);

  const cakeImage = cakes.find((product) => product.images?.[0])?.images?.[0];
  const dessertImage = desserts.find((product) => product.images?.[0])?.images?.[0];
  const heroImage = cakeImage || dessertImage;

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">
      {/* HERO */}
      <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 sm:py-14 md:grid-cols-2 md:gap-12 lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full border border-burgundy/15 bg-white px-4 py-2 text-xs font-semibold tracking-wide text-burgundy">
            Cakes, desserts & custom creations
          </p>
          <h1 className="mt-5 max-w-xl font-display text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">
            A little sweetness,
            <span className="mt-2 block italic text-burgundy">a lot of love.</span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-7 text-olive-dark sm:text-base sm:leading-8">
            Discover celebration cakes and delightful desserts, thoughtfully
            prepared to make your special moments even sweeter.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Link
              href="/cakes"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-burgundy px-5 py-3 text-sm font-semibold text-cream hover:bg-burgundy-dark"
            >
              Shop Cakes
            </Link>
            <Link
              href="/desserts"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-burgundy bg-white px-5 py-3 text-sm font-semibold text-burgundy hover:bg-burgundy hover:text-cream"
            >
              Explore Desserts
            </Link>
          </div>
          <p className="mt-5 text-xs text-olive-dark/75">
            Made to order · Chattogram delivery and pickup
          </p>
        </div>

        <div className="relative">
          {heroImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-olive/10">
              <Image
                src={heroImage}
                alt="Cakes and desserts by Cakes by Aspeya"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center rounded-[2rem] bg-olive/10 p-8 text-center font-display text-3xl text-olive">
              Made for your moments
            </div>
          )}
        </div>
      </section>

      {/* MAIN SHOPPING CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <SectionHeading
          eyebrow="Find your favourite"
          title="What are you craving today?"
          text="Explore our two collections and find something special for every celebration or everyday treat."
        />
        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          <CollectionCard
            title="Celebration Cakes"
            description="Beautiful cakes for birthdays, anniversaries and all your special moments."
            href="/cakes"
            image={cakeImage}
            label="The cake collection"
          />
          <CollectionCard
            title="Desserts & Treats"
            description="Discover delicious desserts, individual treats and sweet gifts to enjoy or share."
            href="/desserts"
            image={dessertImage}
            label="The dessert collection"
          />
        </div>
      </section>

      {/* FEATURED DESSERTS — intentionally placed before cakes */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="More than just cakes"
            title="Discover our desserts"
            text="From creamy indulgences to bite-sized delights, find a sweet treat for any time of day."
          />
          <Link
            href="/desserts"
            className="inline-flex w-fit items-center rounded-full border border-burgundy/30 px-5 py-3 text-sm font-semibold text-burgundy hover:bg-burgundy hover:text-cream"
          >
            View all desserts →
          </Link>
        </div>

        {featuredDesserts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {featuredDesserts.map((product) => (
              <div key={product.slug} className="min-w-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-olive/15 bg-white p-8 text-center">
            <p className="font-display text-2xl">Desserts are coming soon</p>
            <p className="mt-2 text-sm text-olive-dark">
              Please check back soon to explore our dessert collection.
            </p>
          </div>
        )}

        <Link
          href="/desserts"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-burgundy px-5 py-3.5 text-sm font-semibold text-cream hover:bg-burgundy-dark"
        >
          Explore the full dessert menu →
        </Link>
      </section>

      {/* FEATURED CAKES */}
      <section className="bg-white/55 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Made for your moments"
              title="Featured cakes"
              text="Explore customer favourites and designs for your next celebration."
            />
            <Link
              href="/cakes"
              className="inline-flex w-fit items-center rounded-full border border-burgundy/30 px-5 py-3 text-sm font-semibold text-burgundy hover:bg-burgundy hover:text-cream"
            >
              View all cakes →
            </Link>
          </div>

          {featuredCakes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {featuredCakes.map((product) => (
                <div key={product.slug} className="min-w-0">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-cream p-8 text-center text-sm text-olive-dark">
              Our cake collection will be available here soon.
            </p>
          )}
        </div>
      </section>

      {/* OCCASIONS */}
      {occasions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <SectionHeading
            eyebrow="Celebrate in style"
            title="Shop by occasion"
            text="Find inspiration for birthdays, anniversaries and thoughtful surprises."
          />
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.slug}
                href={`/occasions/${occasion.slug}`}
                className="group relative flex min-h-40 flex-col justify-end overflow-hidden rounded-2xl bg-olive/10 p-4 sm:min-h-56 sm:p-6"
              >
                {occasion.image_url && (
                  <Image
                    src={occasion.image_url}
                    alt={occasion.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <span className="relative text-2xl text-white">{occasion.symbol}</span>
                <h3 className="relative mt-2 font-display text-xl text-white sm:text-2xl">
                  {occasion.title}
                </h3>
                {occasion.subtitle && (
                  <p className="relative mt-1 line-clamp-2 text-xs text-white/80 sm:text-sm">
                    {occasion.subtitle}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CUSTOM CAKES */}
      <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-burgundy px-6 py-10 text-cream sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/70">
            Your idea, made special
          </p>
          <div className="mt-3 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="max-w-2xl font-display text-3xl sm:text-4xl">
                Have a cake design in mind?
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-cream/80">
                Send us your inspiration, preferred flavour and occasion.
                We will discuss the design and confirm the price with you.
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-burgundy hover:bg-white"
            >
              Discuss your design on WhatsApp →
            </a>
          </div>
        </div>
      </section>

      {/* HOW TO ORDER */}
      <section className="bg-olive py-12 text-cream sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/65">
              Simple and convenient
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              How to order
            </h2>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Choose your favourite', 'Browse our cakes and desserts or share a custom design.'],
              ['02', 'Confirm the details', 'We will confirm the flavour, size, design, availability and price.'],
              ['03', 'Enjoy your order', 'Once confirmed, we will prepare your order for the agreed date.'],
            ].map(([number, title, description]) => (
              <div key={number} className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="font-display text-4xl text-cream/45">{number}</p>
                <h3 className="mt-4 font-display text-2xl">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-cream/75">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORDER TRACKING */}
      <section id="track-order" className="scroll-mt-24">
        <TrackOrderWidget />
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
            Good to know
          </p>
          <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="mt-7 space-y-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-olive/15 bg-white px-5 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink">
                {item.q}
                <span className="text-xl text-burgundy">+</span>
              </summary>
              <p className="mt-3 text-sm leading-7 text-olive-dark">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* DELIVERY & PICKUP */}
      <section className="border-t border-olive/10 bg-white/55 py-12 sm:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-burgundy">
              Collection and delivery
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink">
              Getting your order
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-olive/10 bg-white p-5">
              <h3 className="font-display text-xl">City delivery</h3>
              <p className="mt-2 text-sm leading-7 text-olive-dark">
                Delivery is available within Chattogram city. Charges are confirmed when your order is finalised.
              </p>
            </div>
            <div className="rounded-2xl border border-olive/10 bg-white p-5">
              <h3 className="font-display text-xl">Pickup</h3>
              <p className="mt-2 text-sm leading-7 text-olive-dark">
                Pickup can be arranged at Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
