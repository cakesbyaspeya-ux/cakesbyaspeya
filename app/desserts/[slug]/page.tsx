import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

export default async function DessertDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sb = await createServerClient();

  const { data: product, error } = await sb
    .from('products')
    .select(`
      id, slug, name, short_desc, long_desc, product_type,
      allows_flavour, allows_cake_message, allows_size, base_price,
      product_images(id, url, sort_order),
      product_sizes(id, label, weight_lb, price, is_default, sort_order),
      product_variants(id, name, price_delta, sort_order),
      product_flavours(flavours(id, name, price_delta))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) notFound();

  // Fetch related desserts
  const { data: relatedData } = await sb
    .from('products')
    .select(`
      slug, name, product_type, image_layout, base_price,
      product_images(url, sort_order),
      product_sizes(price),
      product_flavours(flavours(name))
    `)
    .eq('product_type', 'dessert')
    .neq('slug', slug)
    .eq('is_active', true)
    .limit(4);

  const relatedProducts = (relatedData ?? []).map((p: any) => {
    const images = (p.product_images ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order).map((i: any) => i.url);
    const validPrices = (p.product_sizes ?? []).map((s: any) => Number(s.price)).filter((n: number) => n > 0);
    const from_price = validPrices.length > 0 ? Math.min(...validPrices) : Number(p.base_price) || 0;
    const flavours = (p.product_flavours ?? []).map((pf: any) => pf.flavours?.name).filter(Boolean);
    return { slug: p.slug, name: p.name, product_type: p.product_type, image_layout: p.image_layout, images, from_price, flavours };
  });

  const images = (product.product_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((i: any, index: number) => ({ id: i.id, url: i.url, label: `Design ${index + 1}` }));

  const sizes = (product.product_sizes ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const variants = (product.product_variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const flavours = (product.product_flavours ?? []).map((pf: any) => pf.flavours).filter(Boolean);

  return (
    <ProductDetailClient
      product={{
        id: product.id, slug: product.slug, name: product.name, short_desc: product.short_desc, long_desc: product.long_desc,
        allows_flavour: product.allows_flavour, allows_cake_message: product.allows_cake_message, allows_size: product.allows_size,
        base_price: Number(product.base_price), images, sizes, variants, flavours,
      }}
      relatedProducts={relatedProducts}
    />
  );
}