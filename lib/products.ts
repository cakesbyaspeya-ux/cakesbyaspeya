import { createServerClient } from '@/lib/supabase/server';

export type ProductCardData = {
  slug: string;
  name: string;
  product_type: 'cake' | 'dessert';
  image_layout: 'slideshow' | 'static';
  images: string[];
  from_price: number;
};

export async function getProducts(product_type: 'cake' | 'dessert'): Promise<ProductCardData[]> {
  const sb = await createServerClient();

  const { data, error } = await sb
    .from('products')
    .select(`
      slug, name, product_type, image_layout, base_price,
      product_images(url, sort_order), product_sizes(price)
    `)
    .eq('product_type', product_type)
    .eq('is_active', true)
    .order('sort_order');

  if (error || !data) return [];

  return data.map((p: any) => {
    const images = (p.product_images ?? [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((i: any) => i.url);

    const validPrices = (p.product_sizes ?? [])
      .map((s: any) => Number(s.price))
      .filter((n: number) => n > 0);

    const from_price = validPrices.length > 0 ? Math.min(...validPrices) : Number(p.base_price) || 0;

    return {
      slug: p.slug, name: p.name, product_type: p.product_type,
      image_layout: p.image_layout, images, from_price,
    };
  });
}