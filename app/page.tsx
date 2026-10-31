import Link from 'next/link';
import Image from 'next/image';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';
import { TrackOrderWidget } from '@/components/home/TrackOrderWidget';
import { createServerClient } from '@/lib/supabase/server';

const WHATSAPP_URL = 'https://wa.me/8801519409555?text=Hi%20Cakes%20by%20Aspeya!%20I%20would%20like%20to%20place%20an%20order.';

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
  const heroImage = cakes.find((product) => product.images?.[0])?.images?.[0] || desserts.find((product) => product.images?.[0])?.images?.[0];

  return (
    <main className="min-w-0 overflow-x-clip bg-cream text-ink">
      {/* HERO SECTION */}
      <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="animate-[fadeInUp_0.8s_ease-out_both]">
            <span className="inline-flex rounded-full border border-burgundy/20 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-burgundy shadow-sm">
              Freshly baked in Chattogram
            </span>
            <h1 className="mt-6 max-w-xl font-display text-5xl leading-[1.1] text-ink sm:text-6xl lg:text-7xl">
              A little sweetness, <br/>
              <span className="italic text-burgundy">a lot of love.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-olive-dark sm:text-lg">
              Discover celebration cakes and delightful desserts, thoughtfully prepared to make your special moments even sweeter.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/custom-cake" className="inline-flex h-14 items-center justify-center rounded-full bg-burgundy px-8 text-base font-semibold text-cream shadow-lg shadow-burgundy/20 transition-all hover:-translate-y-1 hover:bg-burgundy-dark">
                🎂 Order Now
              </Link>
              <Link href="/cakes" className="inline-flex h-14 items-center justify-center rounded-full border border-olive/30 bg-white px-8 text-base font-semibold text-olive-dark transition-all hover:-translate-y-1 hover:border-olive hover:bg-olive/5">
                View Catalogue
              </Link>
            </div>
            <p className="mt-6 text-xs text-olive-dark/70 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Minimum 24 hours advance notice required
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -m-4 rounded-[2.5rem] bg-gradient-to-tr from-burgundy/10 to-olive/10 blur-2xl"></div>
            {heroImage ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl">
                <Image src={heroImage} alt="Featured Cake" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ) : (
              <div className="flex aspect-[4/5] items-center justify-center rounded-[2rem] bg-olive/10 font-display text-3xl text-olive">Made for you</div>
            )}
          </div>
        </div>
      </section>

      {/* QUICK CATEGORIES */}
      <section className="border-y border-olive/10 bg-white/40 py-12">
         <div className="mx-auto max-w-7xl px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/cakes" className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 hover:-translate-y-1 transition flex flex-col items-center text-center">
               <span className="text-3xl mb-3 group-hover:scale-110 transition">🎂</span>
               <h3 className="font-display text-lg">Celebration Cakes</h3>
            </Link>
            <Link href="/desserts" className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 hover:-translate-y-1 transition flex flex-col items-center text-center">
               <span className="text-3xl mb-3 group-hover:scale-110 transition">🍰</span>
               <h3 className="font-display text-lg">Desserts</h3>
            </Link>
            <Link href="/custom-cake" className="group rounded-2xl bg-burgundy p-6 shadow-sm ring-1 ring-burgundy text-cream hover:-translate-y-1 transition flex flex-col items-center text-center">
               <span className="text-3xl mb-3 group-hover:scale-110 transition">🖼️</span>
               <h3 className="font-display text-lg">Upload Design</h3>
            </Link>
            <Link href="#track-order" className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 hover:-translate-y-1 transition flex flex-col items-center text-center">
               <span className="text-3xl mb-3 group-hover:scale-110 transition">📦</span>
               <h3 className="font-display text-lg">Track Order</h3>
            </Link>
         </div>
      </section>

      {/* FEATURED CAKES & OCCASIONS (Kept your existing logic) */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl text-ink mb-8">Shop by Occasion</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {occasions.map((occasion) => (
            <Link key={occasion.slug} href={`/occasions/${occasion.slug}`} className="group relative flex min-h-[200px] flex-col justify-end overflow-hidden rounded-3xl bg-olive/10 p-6 shadow-sm hover:-translate-y-1 transition">
              {occasion.image_url && <Image src={occasion.image_url} alt={occasion.title} fill className="object-cover -z-10" />}
              <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent -z-10" />
              <h3 className="relative mt-2 font-display text-2xl text-white">{occasion.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white/50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl text-ink">Featured Cakes</h2>
            <Link href="/cakes" className="text-sm font-semibold text-burgundy hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {featuredCakes.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section id="track-order" className="scroll-mt-24">
        <TrackOrderWidget />
      </section>
    </main>
  );
}