import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/product/ProductCard';

export const metadata = {
  title: 'Desserts',
};

export default async function DessertsPage() {
  const desserts = await getProducts('dessert');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="font-display text-4xl text-ink md:text-5xl mb-8">Desserts</h1>
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {desserts.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  );
}