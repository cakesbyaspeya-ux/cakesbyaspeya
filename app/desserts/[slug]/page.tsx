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
      product_images(url, sort_order),
      product_sizes(id, label, weight_lb, price, is_default, sort_order),
      product_variants(id, name, price_delta, sort_order),
      product_flavours(flavours(id, name, price_delta))
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  const images = (product.product_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((i: any) => i.url);

  const sizes = (product.product_sizes ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const variants = (product.product_variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const flavours = (product.product_flavours ?? [])
    .map((pf: any) => pf.flavours)
    .filter(Boolean);

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        slug: product.slug,
        name: product.name,
        short_desc: product.short_desc,
        long_desc: product.long_desc,
        allows_flavour: product.allows_flavour,
        allows_cake_message: product.allows_cake_message,
        allows_size: product.allows_size,
        base_price: Number(product.base_price),
        images,
        sizes,
        variants,
        flavours,
      }}
    />
  );
}