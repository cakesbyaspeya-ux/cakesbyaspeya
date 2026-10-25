import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/product/ProductGrid';

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
    </div>
  );
}