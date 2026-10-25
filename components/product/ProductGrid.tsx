'use client';

import { useState, useMemo } from 'react';
import { ProductCard, type ProductCardData } from './ProductCard';

export function ProductGrid({ initialProducts }: { initialProducts: ProductCardData[] }) {
  const [search, setSearch] = useState('');
  const [flavour, setFlavour] = useState('All');
  const [sort, setSort] = useState('default');

  // Extract all unique flavours for the dropdown
  const allFlavours = useMemo(() => {
    const flavours = new Set<string>();
    initialProducts.forEach(p => p.flavours.forEach(f => flavours.add(f)));
    return ['All', ...Array.from(flavours)].sort();
  }, [initialProducts]);

  // Apply search, flavour filter, and sorting
  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    // 1. Search by name
    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query));
    }

    // 2. Filter by Flavour
    if (flavour !== 'All') {
      result = result.filter(p => p.flavours.includes(flavour));
    }

    // 3. Sort
    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.from_price - b.from_price);
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.from_price - a.from_price);
    } else if (sort === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [initialProducts, search, flavour, sort]);

  return (
    <div>
      {/* Sticky Filter Bar */}
      <div className="sticky top-16 z-30 mb-8 rounded-2xl bg-cream/90 p-3 md:p-4 backdrop-blur-md ring-1 ring-black/5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-dark">🔍</span>
            <input
              type="text"
              placeholder="Search cakes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border-none bg-white/70 py-2.5 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-burgundy transition-all"
            />
          </div>

          {/* Flavour Filter */}
          <select
            value={flavour}
            onChange={(e) => setFlavour(e.target.value)}
            className="rounded-xl border-none bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-burgundy cursor-pointer min-w-[140px]"
          >
            {allFlavours.map(f => (
              <option key={f} value={f}>Flavour: {f}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border-none bg-white/70 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-burgundy cursor-pointer min-w-[160px]"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-cream-card p-12 text-center ring-1 ring-black/5">
          <div className="text-4xl mb-3 opacity-50">🔍</div>
          <h3 className="font-display text-xl text-ink">No cakes found</h3>
          <p className="text-sm text-olive-dark mt-1">Try adjusting your search or filters.</p>
          <button 
            onClick={() => { setSearch(''); setFlavour('All'); setSort('default'); }}
            className="mt-4 text-sm font-medium text-burgundy hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}