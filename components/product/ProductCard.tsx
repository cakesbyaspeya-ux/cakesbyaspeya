import Link from 'next/link';
import { ImageSlideshow } from './ImageSlideshow';

export type ProductCardData = {
  slug: string;
  name: string;
  product_type: 'cake' | 'dessert';
  image_layout: 'slideshow' | 'static';
  images: string[];
  from_price: number;
  flavours: string[];
};

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = `/${product.product_type === 'cake' ? 'cakes' : 'desserts'}/${product.slug}`;

  return (
    <Link href={href} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cream-dark)]">
        <ImageSlideshow images={product.images} alt={product.name} />
      </div>
      <div className="pt-4">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-burgundy">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-ink-muted">
          {product.from_price > 0 ? `From ${PKR(product.from_price)}` : 'Custom pricing'}
        </p>
      </div>
    </Link>
  );
}