import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/product/ProductGrid';
import Link from 'next/link';

export const metadata = {
  title: 'Our Cakes',
};

export default async function CakesPage() {
  const cakes = await getProducts('cake');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink md:text-5xl">Our Cakes</h1>
        <p className="mt-2 text-sm text-olive-dark max-w-xl">
          Every cake is made to order. Choose your size (0.5 lb to 3 lb), flavour, and add a personal message.
        </p>
      </div>
      
      <ProductGrid initialProducts={cakes} />

      {/* 👇 NEW CUSTOM UPLOAD BANNER 👇 */}
      <div className="mt-16 rounded-3xl bg-olive p-8 sm:p-12 text-center text-cream shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-3xl mb-3">Can't find what you're looking for?</h2>
          <p className="text-cream/80 mb-6 text-sm sm:text-base">
            Upload a reference photo of your dream cake, and our bakers will recreate it for you.
          </p>
          <Link 
            href="/cakes/chocolate-cake" 
            className="inline-flex items-center justify-center gap-2 rounded-full bg-cream px-8 py-3.5 text-sm font-semibold text-olive hover:bg-white hover:-translate-y-0.5 transition-all shadow-md"
          >
            🖼️ Upload Your Own Design
          </Link>
        </div>
      </div>
    </div>
  );
}