import { createServerClient } from '@/lib/supabase/server';
import { CustomCakeClient } from './CustomCakeClient';

export const metadata = {
  title: 'Custom Cake | Cakes by Aspeya',
};

export default async function CustomCakePage() {
  const sb = await createServerClient();

  const { data: product } = await sb
    .from('products')
    .select(`
      id, slug, name, base_price,
      product_sizes(id, label, price, is_default, sort_order),
      product_flavours(flavours(id, name, price_delta)),
      product_variants(id, name, price_delta, sort_order)
    `)
    .eq('slug', 'custom-cake')
    .single();

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-2">Setup Required</h1>
        <p className="text-olive-dark">Please add the 'custom-cake' product in your database to enable this page.</p>
      </div>
    );
  }

  const sizes = (product.product_sizes ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);
  const flavours = (product.product_flavours ?? []).map((pf: any) => pf.flavours).filter(Boolean);
  const variants = (product.product_variants ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order);

  return (
    <CustomCakeClient 
      product={{
        id: product.id,
        name: product.name,
        base_price: Number(product.base_price),
        sizes: sizes,
        flavours: flavours,
        variants: variants // 👈 Pass the occasions (variants)
      }}
    />
  );
}