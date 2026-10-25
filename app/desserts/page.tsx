import { getProducts } from '@/lib/products';
import { ProductGrid } from '@/components/product/ProductGrid';

export const metadata = {
  title: 'Desserts',
};

export default async function DessertsPage() {
  const desserts = await getProducts('dessert');

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink md:text-5xl">Desserts</h1>
        <p className="mt-2 text-sm text-olive-dark max-w-xl">
          Small bites, big smiles. Add a dessert box to your order for the perfect finishing touch.
        </p>
      </div>

      <ProductGrid initialProducts={desserts} />
    </div>
  );
}