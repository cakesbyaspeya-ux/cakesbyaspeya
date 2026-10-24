import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { ProductEditor } from './ProductEditor';

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createServerClient();

  const { data: product, error } = await sb
    .from('products')
    .select(`
      *,
      product_images (id, url, sort_order),
      product_sizes (id, label, weight_lb, price, is_default, sort_order),
      product_variants (id, name, price_delta, sort_order)
    `)
    .eq('id', id)
    .single();

  if (error || !product) {
    notFound();
  }

  return (
    <ProductEditor 
      product={product} 
      images={product.product_images ?? []}
      sizes={product.product_sizes ?? []}
    />
  );
}
