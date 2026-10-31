'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductDetailClient({ product, relatedProducts = [], reviews = [] }: { product: any, relatedProducts?: any[], reviews?: any[] }) {
  const router = useRouter();
  const { add, clear } = useCart();

  const [step, setStep] = useState<1 | 2>(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const [sizeId, setSizeId] = useState<string | null>(product.sizes.find((s: any) => s.is_default)?.id ?? product.sizes[0]?.id ?? null);
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null);
  const [flavourId, setFlavourId] = useState<string | null>(product.flavours[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedSize = product.sizes.find((s: any) => s.id === sizeId);
  const selectedVariant = product.variants.find((v: any) => v.id === variantId);
  const selectedFlavour = product.flavours.find((f: any) => f.id === flavourId);
  
  // Get the currently selected design image object
  const selectedImageObj = product.images[activeImageIndex] || product.images[0];

  // 👇 DYNAMIC PRICING LOGIC 👇
  // If the selected design has a specific price for this size, use it. 
  // Otherwise, use the default product size price.
  const defaultBasePrice = selectedSize?.price ?? product.base_price ?? 0;
  const specificDesignPrice = selectedImageObj?.size_prices?.[selectedSize?.label || ''];
  const basePrice = specificDesignPrice ? Number(specificDesignPrice) : defaultBasePrice;

  const unitPrice = useMemo(() => {
    let price = basePrice;
    if (selectedVariant?.price_delta) price += Number(selectedVariant.price_delta);
    if (selectedFlavour?.price_delta) price += Number(selectedFlavour.price_delta);
    return price;
  }, [basePrice, selectedVariant, selectedFlavour]);

  // Pagination logic for Step 1
  const totalPages = Math.ceil(product.images.length / itemsPerPage);
  const currentImages = product.images.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  function handleAdd() {
    add({
      product_id: product.id, 
      product_slug: product.slug, 
      product_name: product.name,
      image: selectedImageObj?.url || '', 
      design_id: selectedImageObj?.id || null, 
      design_label: selectedImageObj?.label || null,
      custom_design_url: null, 
      variant: selectedVariant?.name ?? null, 
      flavour: selectedFlavour?.name ?? null,
      size_label: selectedSize?.label ?? null, 
      cake_message: null, 
      unit_price: unitPrice, 
      qty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    clear(); 
    handleAdd();
    router.push('/checkout/info');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16 pb-28 md:pb-16">
      
      {/* STEP 1: CHOOSE DESIGN */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-3">{product.name}</h1>
            <p className="text-olive-dark">Select a design to customize your cake.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {currentImages.map((img: any, i: number) => {
              const globalIndex = (page - 1) * itemsPerPage + i;
              const hasSpecificPrice = img.size_prices && Object.keys(img.size_prices).length > 0;
              
              return (
                <button
                  key={img.id}
                  onClick={() => { setActiveImageIndex(globalIndex); setStep(2); }}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-cream-card ring-1 ring-black/5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden">
                    <img src={img.url} alt={img.label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Badge if design has custom prices */}
                    {hasSpecificPrice && (
                      <span className="absolute top-2 right-2 bg-burgundy text-cream text-[10px] font-bold px-2 py-1 rounded-full shadow">
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="p-3 text-left">
                    <p className="text-sm font-medium text-ink truncate">{img.label || `Design ${globalIndex + 1}`}</p>
                    <p className="text-xs text-burgundy mt-1 font-medium">From {PKR(product.sizes[0]?.price || product.base_price)}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="rounded-full border border-olive/30 px-4 py-2 text-sm disabled:opacity-50">Prev</button>
              <span className="text-sm text-olive-dark font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-full border border-olive/30 px-4 py-2 text-sm disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: CUSTOMIZE CAKE */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 grid gap-10 md:grid-cols-2">
          {/* Left: Big Image */}
          <div className="space-y-4">
             <button onClick={() => setStep(1)} className="text-sm font-medium text-olive-dark hover:text-burgundy mb-2 inline-block">← Back to Designs</button>
             <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-dark border border-olive/10 shadow-lg">
                <img src={selectedImageObj?.url} alt="" className="h-full w-full object-cover" />
             </div>
          </div>

          {/* Right: Options & Price */}
          <div>
            <h1 className="font-display text-3xl text-ink">{product.name}</h1>
            <p className="text-sm text-burgundy font-medium mt-1">Design: {selectedImageObj?.label}</p>
            
            {/* Live Price Display */}
            <div className="mt-6 text-4xl font-display text-burgundy">{PKR(unitPrice)}</div>

            {product.allows_size && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-ink">Size / weight</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: any) => {
                    // Calculate dynamic price for this specific size button
                    const baseForThisSize = selectedImageObj?.size_prices?.[s.label] 
                      ? Number(selectedImageObj.size_prices[s.label]) 
                      : Number(s.price);
                    
                    let dynamicTotal = baseForThisSize;
                    if (selectedVariant?.price_delta) dynamicTotal += Number(selectedVariant.price_delta);
                    if (selectedFlavour?.price_delta) dynamicTotal += Number(selectedFlavour.price_delta);

                    return (
                      <button 
                        key={s.id} 
                        type="button" 
                        onClick={() => setSizeId(s.id)} 
                        className={`rounded-full border px-4 py-2 text-sm transition ${sizeId === s.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark hover:border-olive'}`}
                      >
                        {s.label} · {PKR(dynamicTotal)}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {product.variants.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-medium mb-2 text-ink">Type</label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v: any) => (
                    <button type="button" key={v.id} onClick={() => setVariantId(v.id)} className={`rounded-full border px-4 py-2 text-sm transition ${variantId === v.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.allows_flavour && product.flavours.length > 0 && (
              <div className="mt-5">
                <label className="block text-sm font-medium mb-2 text-ink">Flavour</label>
                <select value={flavourId ?? ''} onChange={(e) => setFlavourId(e.target.value || null)} className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy">
                  {product.flavours.map((f: any) => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center rounded-full border border-olive/30 bg-cream-card">
                <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-olive-dark hover:text-burgundy">−</button>
                <span className="w-6 text-center text-sm font-medium">{qty}</span>
                <button type="button" onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-olive-dark hover:text-burgundy">+</button>
              </div>
              <button type="button" onClick={handleAdd} className={`flex-1 rounded-full px-6 py-3.5 text-cream font-medium shadow transition-colors ${added ? 'bg-olive' : 'bg-burgundy hover:bg-burgundy-dark'}`}>
                {added ? '✓ Added to Order' : `Add · ${PKR(unitPrice * qty)}`}
              </button>
            </div>
            
            <button type="button" onClick={handleBuyNow} className="mt-3 w-full rounded-full border border-olive px-6 py-3.5 text-olive-dark font-medium hover:bg-olive hover:text-cream transition">
              Buy Now
            </button>
          </div>
        </div>
      )}
    </main>
  );
}