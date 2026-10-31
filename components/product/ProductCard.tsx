import Link from 'next/link';
import Image from 'next/image';

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
  const coverImage = product.images?.[0];

  return (
    <Link href={href} className="group block transition-transform duration-300 hover:-translate-y-1.5">
      <div className="overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md shadow-sm ring-1 ring-black/5 transition-shadow group-hover:shadow-xl">
        
        {/* Static Cover Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-cream-dark">
          {coverImage ? (
            <Image 
              src={coverImage} 
              alt={product.name} 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
              sizes="(max-width: 768px) 50vw, 33vw" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl opacity-30">🎂</div>
          )}
        </div>

        <div className="p-4 bg-white/40">
          <h3 className="font-display text-lg leading-tight text-ink">
            {product.name}
          </h3>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-sm text-olive-dark">
              {product.from_price > 0 ? `From ${PKR(product.from_price)}` : 'Custom pricing'}
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