import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';

export default async function AdminProductsList() {
  const sb = await createServerClient();
  
  const { data: products } = await sb
    .from('products')
    .select('id, name, product_type, is_active, is_sold_out, sort_order')
    .order('sort_order');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">Products</h1>
      </div>

      <div className="space-y-3">
        {products && products.length > 0 ? (
          products.map((p) => (
            <Link 
              key={p.id} 
              href={`/admin/products/${p.id}`}
              className="flex items-center justify-between rounded-2xl bg-cream-card p-4 ring-1 ring-black/5 hover:ring-burgundy/30 transition"
            >
              <div>
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-xs text-olive-dark capitalize mt-0.5">
                  {p.product_type} 
                  {!p.is_active && <span className="ml-2 text-burgundy">• Inactive</span>}
                  {p.is_sold_out && <span className="ml-2 text-burgundy">• Sold Out</span>}
                </p>
              </div>
              <span className="text-sm font-medium text-burgundy">Edit →</span>
            </Link>
          ))
        ) : (
          <p className="p-6 text-center text-sm text-olive-dark">No products found.</p>
        )}
      </div>
    </div>
  );
}