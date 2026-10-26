import { createServerClient } from '@/lib/supabase/server';
import { ProductCard } from '@/components/product/ProductCard';
import Image from 'next/image';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createServerClient();
  const { data } = await sb.from('occasions').select('title').eq('slug', slug).single();
  return { title: data?.title ? `Cakes for ${data.title}` : 'Occasion' };
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createServerClient();

  // Fetch the occasion details
  const { data: occasion } = await sb.from('occasions').select('*').eq('slug', slug).single();

  // Fetch products matching this occasion
  const { data: products, error } = await sb
    .from('products')
    .select(`
      slug, name, product_type, image_layout, base_price,
      product_images(url, sort_order),
      product_sizes(price),
      product_flavours(flavours(name))
    `)
    .eq('occasion', slug)
    .eq('is_active', true);

  if (error) console.error(error);

  // Format products for the ProductCard
  const formattedProducts = (products ?? []).map((p: any) => {
    const images = (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.url);
    const validPrices = (p.product_sizes ?? []).map((s: any) => Number(s.price)).filter((n: number) => n > 0);
    const from_price = validPrices.length > 0 ? Math.min(...validPrices) : Number(p.base_price) || 0;
    const flavours = (p.product_flavours ?? []).map((pf: any) => pf.flavours?.name).filter(Boolean);
    
    return { slug: p.slug, name: p.name, product_type: p.product_type, image_layout: p.image_layout, images, from_price, flavours };
  });

  const title = occasion?.title || slug.charAt(0).toUpperCase() + slug.slice(1).replace('-', ' ');
  const subtitle = occasion?.subtitle || `Find the perfect cake to make your ${title.toLowerCase()} unforgettable.`;

  return (
    <div>
      {/* Dynamic Hero Banner */}
      <div className="relative w-full h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden bg-cream-dark">
        {occasion?.image_url ? (
          <>
            <Image 
              src={occasion.image_url} 
              alt={title} 
              fill 
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/50" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[150px] opacity-10">
            {occasion?.symbol || '🎂'}
          </div>
        )}
        
        <div className="relative z-10 text-center px-4">
          <h1 className={`font-display text-4xl md:text-6xl mb-4 ${occasion?.image_url ? 'text-white' : 'text-ink'}`}>
            Cakes for {title}
          </h1>
          <p className={`max-w-xl mx-auto text-lg ${occasion?.image_url ? 'text-white/90' : 'text-olive-dark'}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mx-auto max-w-6xl px-4 py-16">
        {formattedProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-olive-dark">No cakes found for this occasion yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {formattedProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}