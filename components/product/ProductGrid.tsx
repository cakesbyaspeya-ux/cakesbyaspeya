'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import type { ProductCardData } from '@/lib/products';

export function ProductGrid({ initialProducts }: { initialProducts: ProductCardData[] }) {
  const [search, setSearch] = useState('');
  const [flavour, setFlavour] = useState('All');
  const [sort, setSort] = useState('default');

  const allFlavours = useMemo(() => {
    const flavours = new Set<string>();
    initialProducts.forEach((p) => (p.flavours || []).forEach((f) => flavours.add(f)));
    return ['All', ...Array.from(flavours)].sort();
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    let result = initialProducts;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (flavour !== 'All') {
      result = result.filter((p) => (p.flavours || []).includes(flavour));
    }
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.from_price - b.from_price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.from_price - a.from_price);
    if (sort === 'name') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [initialProducts, search, flavour, sort]);

  return (
    <div>
      {/* Filter bar — clean, inline */}
      <div className="flex flex-col gap-3 border-y border-[var(--color-border)] py-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cakes…"
            className="w-full border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-ink"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
            className="border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            aria-label="Filter by flavour"
          >
            {allFlavours.map((f) => (
              <option key={f} value={f}>{f === 'All' ? 'All flavours' : f}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-[var(--color-border)] bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-ink"
            aria-label="Sort products"
          >
            <option value="default">Featured</option>
            <option value="price-asc">Price ↑</option>
            <option value="price-desc">Price ↓</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="border border-[var(--color-border)] bg-white p-12 text-center">
          <p className="font-display text-xl text-ink">No cakes match your search</p>
          <p className="mt-1 text-sm text-ink-muted">Try adjusting the filters or search term.</p>
          <button
            onClick={() => { setSearch(''); setFlavour('All'); setSort('default'); }}
            className="mt-4 text-sm font-medium text-burgundy hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}