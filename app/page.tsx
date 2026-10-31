
import Link from 'next/link';
import Image from 'next/image';

import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';
import { createServerClient } from '@/lib/supabase/server';

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
  const featuredCakes = cakes.slice(0, 4);
  const featuredDesserts = desserts.slice(0, 4);

  const heroImage =
    cakes.find((product) => product.images?.[0])?.images?.[0] ||
    desserts.find((product) => product.images?.[0])?.images?.[0];

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-olive/20 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-olive-dark">
              <span className="h-2 w-2 rounded-full bg-olive" />
              HANDCRAFTED WITH LOVE
            </span>

            <h1 className="mt-7 font-display text-5xl leading-[1.12] sm:text-6xl lg:text-7xl">
              Every celebration
              <br />
              deserves a little
              <br />
              <span className="italic text-burgundy">
                sweetness.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-olive-dark/90 sm:text-lg">
              Beautifully crafted cakes and delightful desserts,
              made with love to make your special moments
              unforgettable.
            </p>

            {/* Separate Cake & Dessert Buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

              <Link
                href="/cakes"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-burgundy px-7 font-semibold text-cream transition-colors hover:bg-burgundy-dark"
              >
                🎂 Explore Cakes
                <span aria-hidden="true">→</span>
              </Link>

              <Link
                href="/desserts"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-olive/30 bg-white px-7 font-semibold text-olive-dark transition-colors hover:bg-olive/10"
              >
                🍰 Explore Desserts
                <span aria-hidden="true">→</span>
              </Link>

            </div>

            <div className="mt-7 flex items-center gap-2 text-sm text-olive-dark/70">
              <span aria-hidden="true">✦</span>
              Made to order · Minimum 24 hours advance notice
            </div>
          </div>

          {/* HERO IMAGE */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -right-5 -top-5 h-32 w-32 rounded-full bg-burgundy/10 blur-2xl" />
            <div className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-olive/15 blur-2xl" />

            {heroImage ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-xl ring-1 ring-black/5">
                <Image
                  src={heroImage}
                  alt="Beautifully handcrafted cake by Cakes by Aspeya"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-olive/10 font-display text-3xl text-olive">
                Baked with love
              </div>
            )}

            <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/60 bg-white/95 px-5 py-3 shadow-lg backdrop-blur-sm sm:-left-8">
              <p className="font-display text-lg italic text-burgundy">
                A little sweetness,
              </p>
              <p className="text-sm text-olive-dark">
                a lot of love.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* QUICK ACCESS */}
      <section className="border-y border-olive/10 bg-white py-7">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-4 lg:px-8">

          <Link
            href="/cakes"
            className="group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-cream"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/10 text-2xl">
              🎂
            </span>
            <div>
              <p className="font-semibold text-ink">Cakes</p>
              <p className="text-xs text-olive-dark/70">For every occasion</p>
            </div>
          </Link>

          <Link
            href="/desserts"
            className="group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-cream"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-olive/10 text-2xl">
              🍰
            </span>
            <div>
              <p className="font-semibold text-ink">Desserts</p>
              <p className="text-xs text-olive-dark/70">Sweet little treats</p>
            </div>
          </Link>

          <Link
            href="/custom-cake"
            className="group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-cream"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-burgundy/10 text-2xl">
              🎨
            </span>
            <div>
              <p className="font-semibold text-ink">Custom Cakes</p>
              <p className="text-xs text-olive-dark/70">Your dream design</p>
            </div>
          </Link>

          <Link
            href="/#track-order"
            className="group flex items-center gap-3 rounded-2xl p-4 transition-colors hover:bg-cream"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-olive/10 text-2xl">
              📦
            </span>
            <div>
              <p className="font-semibold text-ink">Track Order</p>
              <p className="text-xs text-olive-dark/70">Your order updates</p>
            </div>
          </Link>

        </div>
      </section>

      {/* SHOP BY OCCASION */}
      {occasions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 md:py-20">

          <div className="mb-9 text-center">
            <p className="text-xs font-semibold tracking-[0.2em] text-burgundy">
              MAKE IT MEMORABLE
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Shop by Occasion
            </h2>
            <p className="mt-3 text-sm text-olive-dark/80 sm:text-base">
              A little something for every special moment.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {occasions.map((occasion) => (
              <Link
                key={occasion.slug}
                href={`/occasions/${occasion.slug}`}
                className="group relative flex min-h-[180px] items-end overflow-hidden rounded-2xl bg-olive/10 sm:min-h-[230px]"
              >
                {occasion.image_url && (
                  <Image
                    src={occasion.image_url}
                    alt={occasion.title}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <h3 className="relative z-10 p-4 font-display text-xl text-white sm:p-6 sm:text-2xl">
                  {occasion.title}
                </h3>
              </Link>
            ))}
          </div>

        </section>
      )}

      {/* FEATURED CAKES */}
      <section className="bg-white/60 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-burgundy">
                MADE FOR YOUR MOMENTS
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Our Cakes
              </h2>
              <p className="mt-2 text-sm text-olive-dark/80">
                Beautiful cakes, baked with care.
              </p>
            </div>

            <Link
              href="/cakes"
              className="shrink-0 text-sm font-semibold text-burgundy transition-colors hover:text-burgundy-dark"
            >
              View all →
            </Link>
          </div>

          {featuredCakes.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredCakes.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-olive-dark/70">
              Our cakes are coming soon.
            </p>
          )}

          <div className="mt-9 text-center">
            <Link
              href="/cakes"
              className="inline-flex h-12 items-center justify-center rounded-full border border-burgundy/30 px-7 text-sm font-semibold text-burgundy transition-colors hover:bg-burgundy hover:text-cream"
            >
              Explore All Cakes
            </Link>
          </div>

        </div>
      </section>

      {/* FEATURED DESSERTS — SEPARATE & DISCOVERABLE */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-9 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-olive-dark">
                LITTLE MOMENTS OF JOY
              </p>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl">
                Sweet Treats
              </h2>
              <p className="mt-2 text-sm text-olive-dark/80">
                Because happiness comes in many flavours.
              </p>
            </div>

            <Link
              href="/desserts"
              className="shrink-0 text-sm font-semibold text-olive-dark transition-colors hover:text-burgundy"
            >
              View all →
            </Link>
          </div>

          {featuredDesserts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredDesserts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-olive-dark/70">
              Our desserts are coming soon.
            </p>
          )}

          <div className="mt-9 text-center">
            <Link
              href="/desserts"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-olive px-7 text-sm font-semibold text-white transition-colors hover:bg-olive-dark"
            >
              🍰 Explore All Desserts
              <span aria-hidden="true">→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* CUSTOM CAKE CTA */}
      <section className="px-4 pb-16 sm:px-6 md:pb-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-burgundy px-6 py-14 text-center text-cream sm:px-12 md:py-20">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-black/5" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-cream/70">
              MADE JUST FOR YOU
            </p>

            <h2 className="mt-4 font-display text-3xl leading-tight sm:text-5xl">
              Dream it.
              <span className="italic"> We bake it.</span>
            </h2>

            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-cream/80 sm:text-base">
              Have a special design in mind? Share your inspiration
              with us, and let us create a cake as unique as your celebration.
            </p>

            <Link
              href="/custom-cake"
              className="mt-8 inline-flex h-14 items-center justify-center rounded-full bg-cream px-8 font-semibold text-burgundy transition-colors hover:bg-white"
            >
              Create Your Custom Cake →
            </Link>
          </div>

        </div>
      </section>

      {/* TRACK ORDER */}
      <section id="track-order" className="scroll-mt-24">
        <TrackOrderWidget />
      </section>

    </main>
  );
}
