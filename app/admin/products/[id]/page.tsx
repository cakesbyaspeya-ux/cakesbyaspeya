import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductEditor } from './ProductEditor';

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createServerClient();
  
  // Fetch the product with its relations
  const { data: product } = await sb.from('products').select(`
      *, 
      product_images(*), 
      product_sizes(*), 
      product_variants(*),
      product_flavours(flavour_id)
    `).eq('id', id).single();

  if (!product) notFound();

  // 👇 Fetch all available flavours to pass to the editor
  const { data: allFlavours } = await sb
    .from('flavours')
    .select('*')
    .order('sort_order');

  return (
    <ProductEditor 
      product={product} 
      images={product.product_images ?? []} 
      sizes={product.product_sizes ?? []} 
      allFlavours={allFlavours ?? []} // 👈 Pass it here
    />
  );
}