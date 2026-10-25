'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ProductCard, type ProductCardData } from './ProductCard';

export function RecentlyViewed() {
  const [products, setProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecent() {
      try {
        const stored = localStorage.getItem('cba_recently_viewed');
        if (!stored) {
          setLoading(false);
          return;
        }

        const views = JSON.parse(stored);
        if (views.length === 0) {
          setLoading(false);
          return;
        }

        const slugs = views.map((v: any) => v.slug);
        const sb = createClient();

        // Fetch the product details for the saved slugs
        const { data, error } = await sb
          .from('products')
          .select(`
            slug, name, product_type, image_layout, base_price,
            product_images(url, sort_order),
            product_sizes(price),
            product_flavours(flavours(name))
          `)
          .in('slug', slugs)
          .eq('is_active', true);

        if (error || !data) throw error;

        // Format the data to match ProductCardData
        const formattedProducts = data.map((p: any) => {
          const images = (p.product_images ?? [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((i: any) => i.url);

          const validPrices = (p.product_sizes ?? [])
            .map((s: any) => Number(s.price))
            .filter((n: number) => n > 0);

          const from_price = validPrices.length > 0 ? Math.min(...validPrices) : Number(p.base_price) || 0;
          
          const flavours = (p.product_flavours ?? [])
            .map((pf: any) => pf.flavours?.name)
            .filter(Boolean);

          return {
            slug: p.slug,
            name: p.name,
            product_type: p.product_type,
            image_layout: p.image_layout,
            images,
            from_price,
            flavours,
          };
        });

        // Sort them back into the order they were viewed
        const orderedProducts = slugs.map((slug: string) => 
          formattedProducts.find(p => p.slug === slug)
        ).filter(Boolean);

        setProducts(orderedProducts);
      } catch (err) {
        console.error('Failed to load recently viewed', err);
      } finally {
        setLoading(false);
      }
    }

    loadRecent();
  }, []);

  if (loading || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:py-16 border-t border-olive/10">
      <div className="mb-6">
        <h2 className="font-display text-2xl md:text-3xl text-ink">
          Recently Viewed
        </h2>
        <p className="text-sm text-olive-dark mt-1">Pick up where you left off</p>
      </div>
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </section>
  );
}