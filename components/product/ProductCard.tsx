import Link from 'next/link';
import { ImageSlideshow } from './ImageSlideshow';

export type ProductCardData = {
  slug: string;
  name: string;
  product_type: 'cake' | 'dessert';
  image_layout: 'slideshow' | 'static';
  images: string[];
  from_price: number;
  flavours: string[]; // 👈 ADDED THIS LINE
};

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = `/${product.product_type === 'cake' ? 'cakes' : 'desserts'}/${product.slug}`;

  return (
    <Link href={href} className="group block transition-transform duration-300 hover:-translate-y-1.5">
      <div className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md shadow-sm ring-1 ring-black/5 transition-shadow group-hover:shadow-xl">
        <div className="overflow-hidden rounded-t-2xl">
          <ImageSlideshow images={product.images} alt={product.name} />
        </div>

        <div className="p-4 bg-white/40">
          <h3 className="font-display text-lg leading-tight text-ink">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-olive-dark">
              {product.from_price > 0
                ? `From ${PKR(product.from_price)}`
                : 'Custom pricing'}
            </span>
            <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-xs font-medium text-burgundy">
              {product.product_type === 'cake' ? 'Customisable' : 'Dessert'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}