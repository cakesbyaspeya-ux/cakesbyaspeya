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
    a: 'Browse the collection or send a reference photo on WhatsApp. We confirm flavour, size, design and price before anything is prepared.',
  },
  {
    q: 'Can I request a custom design?',
    a: 'Yes. Share your inspiration and occasion details with us on WhatsApp and we will discuss your design.',
  },
  {
    q: 'Do you deliver?',
    a: 'Delivery is available across Chattogram city. Delivery charges are confirmed when the order is finalised.',
  },
  {
    q: 'Can I pick up my order?',
    a: 'Pickup can be arranged at Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram. Message us to agree on the details.',
  },
];

export default async function HomePage() {
  const sb = await createServerClient();

  const [occasionsRes, cakes, desserts, reviewsRes] = await Promise.all([
    sb.from('occasions').select('*').eq('is_active', true).order('sort_order'),
    getProducts('cake'),
    getProducts('dessert'),
    sb
      .from('reviews')
      .select('customer_name, rating, comment, created_at')
      .gte('rating', 4)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const occasions = occasionsRes.data ?? [];
  const reviews = reviewsRes.data ?? [];
  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 4);

  const heroImage =
    cakes.find((p) => p.images?.[0])?.images?.[0] ||
    desserts.find((p) => p.images?.[0])?.images?.[0];
  const cakeImage = cakes.find((p) => p.images?.[0])?.images?.[0];
  const dessertImage = desserts.find((p) => p.images?.[0])?.images?.[0];

  return (
    <main>
      {/* ─── HERO ─────────────────────────────────── */}
      <section className="container-page pt-12 md:pt-20 lg:pt-24">
        <div className="grid items-end gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-7">
            <p className="eyebrow">Custom cakes · Chattogram</p>
            <h1 className="mt-5 font-display text-[2.75rem] leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
              Cakes for the moments that matter.
            </h1>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ink-light sm:text-base">
              Handcrafted and baked to order in Chattogram. Choose from signature
              collections or share a design of your own — we will bake it to life.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/cakes" className="btn-primary">Shop cakes</Link>
              <Link href="/desserts" className="btn-secondary">Explore desserts</Link>
            </div>

            {/* Trust strip */}
            <ul className="mt-12 grid grid-cols-1 gap-3 border-t border-[var(--color-border)] pt-6 sm:grid-cols-3 sm:gap-6">
              {[
                ['Baked to order', 'Every cake made fresh'],
                ['City-wide delivery', 'Across Chattogram'],
                ['Custom designs', 'Your vision, our craft'],
              ].map(([title, sub]) => (
                <li key={title}>
                  <p className="text-sm font-medium text-ink">{title}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{sub}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-5">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cream-dark)]">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt="Cakes by Aspeya signature cake"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-ink-muted">
                  <span className="font-display text-2xl">Made for you</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── COLLECTIONS ──────────────────────────── */}
      <section className="container-page mt-24 md:mt-32">
        <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Collections</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Two ways to celebrate
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-ink-light">
            Every cake is made to order — choose a signature design, then customise
            flavour, size, and a personal message.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-6">
          {[
            {
              title: 'Celebration cakes',
              description: 'Designs for birthdays, anniversaries and every milestone in between.',
              href: '/cakes',
              image: cakeImage,
            },
            {
              title: 'Desserts & treats',
              description: 'Individual desserts and gift boxes — the perfect finishing touch.',
              href: '/desserts',
              image: dessertImage,
            },
          ].map((c) => (
            <Link key={c.href} href={c.href} className="group relative block aspect-[4/3] overflow-hidden bg-[var(--color-cream-dark)]">
              {c.image && (
                <Image
                  src={c.image}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
                <p className="eyebrow !text-cream/75">Collection</p>
                <h3 className="mt-1 font-display text-2xl sm:text-3xl">{c.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-cream/85">
                  {c.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Explore <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── FEATURED CAKES ───────────────────────── */}
      {featuredCakes.length > 0 && (
        <section className="container-page mt-24 md:mt-32">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Signature cakes</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Customer favourites
              </h2>
            </div>
            <Link href="/cakes" className="text-sm font-medium text-burgundy hover:underline">
              View all cakes →
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
            {featuredCakes.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* ─── OCCASIONS ────────────────────────────── */}
      {occasions.length > 0 && (
        <section className="container-page mt-24 md:mt-32">
          <div className="border-b border-[var(--color-border)] pb-6">
            <p className="eyebrow">Shop by occasion</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              An occasion for every cake
            </h2>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {occasions.map((o) => (
              <Link
                key={o.slug}
                href={`/occasions/${o.slug}`}
                className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden bg-[var(--color-cream-dark)]"
              >
                {o.image_url && (
                  <Image
                    src={o.image_url}
                    alt={o.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                )}
                <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="relative p-4 text-cream sm:p-5">
                  <h3 className="font-display text-lg leading-tight sm:text-xl">{o.title}</h3>
                  {o.subtitle && (
                    <p className="mt-1 line-clamp-2 text-xs text-cream/75">{o.subtitle}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── PROCESS ──────────────────────────────── */}
      <section className="container-page mt-24 md:mt-32">
        <div className="border-b border-[var(--color-border)] pb-6">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Ordering is simple
          </h2>
        </div>

        <ol className="mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {[
            ['01', 'Choose your cake', 'Pick a signature design, or upload a reference image of your own.'],
            ['02', 'Confirm the details', 'We will confirm flavour, size, availability and price with you on WhatsApp.'],
            ['03', 'Enjoy your order', 'Freshly baked on the day and ready for delivery or pickup.'],
          ].map(([num, title, text]) => (
            <li key={num}>
              <p className="font-display text-4xl text-[var(--color-gold)]">{num}</p>
              <h3 className="mt-3 font-display text-xl text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-light">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ─── CUSTOM CTA ───────────────────────────── */}
      <section className="container-page mt-24 md:mt-32">
        <div className="border border-[var(--color-border)] bg-[var(--color-cream-card)] p-8 sm:p-12 md:p-16">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <p className="eyebrow">Made for you</p>
              <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
                Have a design in mind?
              </h2>
              <p className="mt-3 max-w-lg text-[0.9375rem] leading-relaxed text-ink-light">
                Upload a reference photo of your dream cake. We will discuss the
                design, agree on price, and bake it for your date.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link href="/cakes" className="btn-primary whitespace-nowrap">
                Browse cakes
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary whitespace-nowrap"
              >
                Ask on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── REVIEWS ──────────────────────────────── */}
      {reviews.length > 0 && (
        <section className="container-page mt-24 md:mt-32">
          <div className="border-b border-[var(--color-border)] pb-6">
            <p className="eyebrow">Kind words</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              From our customers
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-6">
            {reviews.map((r, i) => (
              <figure key={i} className="border border-[var(--color-border)] bg-white p-6">
                <div className="flex items-center gap-0.5 text-[var(--color-gold)]" aria-label={`${r.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" className="h-3.5 w-3.5" fill={s < r.rating ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1">
                      <path d="M10 1.5l2.6 5.4 5.9.85-4.25 4.15 1 5.9L10 15.05 4.75 17.8l1-5.9L1.5 7.75l5.9-.85L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="mt-3 text-[0.9375rem] leading-relaxed text-ink">
                  “{r.comment || 'Delicious cake, beautifully made.'}”
                </blockquote>
                <figcaption className="mt-4 text-xs font-medium text-ink-muted">
                  {r.customer_name} · Verified customer
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ─── TRACK ORDER ──────────────────────────── */}
      <div className="mt-24 md:mt-32">
        <TrackOrderWidget />
      </div>

      {/* ─── FAQ ──────────────────────────────────── */}
      <section className="container-page mt-24 md:mt-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <p className="eyebrow">Good to know</p>
            <h2 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Frequently asked questions
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-light">
              Anything else on your mind? Message us on WhatsApp — we usually reply
              within a couple of hours.
            </p>
          </div>

          <div className="md:col-span-8">
            {FAQS.map((item, i) => (
              <details
                key={item.q}
                className={`group py-5 ${i !== 0 ? 'border-t border-[var(--color-border)]' : 'border-t border-[var(--color-border)]'}`}
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                  <span className="font-display text-lg text-ink">{item.q}</span>
                  <svg viewBox="0 0 24 24" className="mt-1.5 h-4 w-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-light">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FOOTER CTA (delivery & pickup) ───────── */}
      <section className="container-page mt-24 md:mt-32">
        <div className="grid gap-4 border-t border-[var(--color-border)] pt-10 md:grid-cols-2 md:gap-12">
          <div>
            <p className="eyebrow">Getting your order</p>
            <h2 className="mt-2 font-display text-2xl tracking-tight text-ink sm:text-3xl">
              Delivery & pickup
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-ink">City delivery</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-light">
                Across Chattogram. Charges confirmed on WhatsApp when the order is finalised.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-ink">Pickup</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-light">
                Sanmar Ocean City, 2 No. Gate or Women College Mor, Chattogram.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}