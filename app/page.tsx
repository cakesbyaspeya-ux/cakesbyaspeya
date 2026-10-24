import Link from 'next/link';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';

export default async function HomePage() {
  const [cakes, desserts] = await Promise.all([
    getProducts('cake'),
    getProducts('dessert'),
  ]);

  const heroImage = cakes.find((c) => c.images.length > 0)?.images[0];

  return (
    <div>
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
              Custom cakes, cheesecakes, and desserts — baked fresh with love in Chittagong.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cakes" className="rounded-full bg-burgundy px-6 py-3 text-sm font-medium text-cream hover:bg-burgundy-dark">
                Browse Cakes
              </Link>
            </div>
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-dark shadow-soft">
            {heroImage ? (
              <img src={heroImage} alt="Featured cake" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-8xl opacity-30">🎂</div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-display text-3xl text-ink md:text-4xl mb-8">Our Cakes</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {cakes.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h2 className="font-display text-3xl text-ink md:text-4xl mb-8">Desserts</h2>
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-6">
          {desserts.map((p) => <ProductCard key={p.slug} product={p} />)}
        </div>
      </section>
    </div>
  );
}