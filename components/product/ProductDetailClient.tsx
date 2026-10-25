'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ImageSlideshow } from './ImageSlideshow';
import { useCart } from '@/components/cart/CartProvider';
import { ProductCard, type ProductCardData } from './ProductCard'; 
import { createClient } from '@/lib/supabase/client';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductDetailClient({ 
  product, 
  relatedProducts = [], 
  reviews = [] 
}: { 
  product: any, 
  relatedProducts?: ProductCardData[], 
  reviews?: any[] 
}) {
  const router = useRouter();
  const { add, clear } = useCart(); // 👈 Added 'clear' here
  const sb = createClient();

  const [sizeId, setSizeId] = useState<string | null>(
    product.sizes.find((s: any) => s.is_default)?.id ?? product.sizes[0]?.id ?? null
  );
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null);
  const [flavourId, setFlavourId] = useState<string | null>(product.flavours[0]?.id ?? null);
  const [cakeMessage, setCakeMessage] = useState('');
  const [qty, setQty] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const [added, setAdded] = useState(false);

  // Custom Design Upload States
  const [customDesignUrl, setCustomDesignUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 👇 FIX 1: Reset the "Added" button if the user changes any selection
  useEffect(() => {
    setAdded(false);
  }, [sizeId, variantId, flavourId, cakeMessage, qty, activeImageIndex, customDesignUrl]);

  // Recently viewed tracker
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cba_recently_viewed');
      let views = stored ? JSON.parse(stored) : [];
      views = views.filter((v: any) => v.slug !== product.slug);
      views.unshift({ slug: product.slug, type: product.product_type });
      views = views.slice(0, 6);
      localStorage.setItem('cba_recently_viewed', JSON.stringify(views));
    } catch (e) {}
  }, [product.slug, product.product_type]);

  const selectedSize = product.sizes.find((s: any) => s.id === sizeId);
  const selectedVariant = product.variants.find((v: any) => v.id === variantId);
  const selectedFlavour = product.flavours.find((f: any) => f.id === flavourId);
  const selectedImageObj = product.images[activeImageIndex] || product.images[0];

  const unitPrice = useMemo(() => {
    let price = selectedSize?.price ?? product.base_price ?? 0;
    if (selectedVariant?.price_delta) price += selectedVariant.price_delta;
    if (selectedFlavour?.price_delta) price += selectedFlavour.price_delta;
    return price;
  }, [selectedSize, selectedVariant, selectedFlavour, product.base_price]);

  // Centralized payload so we don't repeat ourselves
  const itemPayload = useMemo(() => ({
    product_id: product.id,
    product_slug: product.slug,
    product_name: product.name,
    image: selectedImageObj?.url || '',
    design_id: selectedImageObj?.id || null,
    design_label: selectedImageObj?.label || null,
    custom_design_url: customDesignUrl,
    variant: selectedVariant?.name ?? null,
    flavour: selectedFlavour?.name ?? null,
    size_label: selectedSize?.label ?? null,
    cake_message: cakeMessage.trim() || null,
    unit_price: unitPrice,
    qty,
  }), [product, selectedImageObj, customDesignUrl, selectedVariant, selectedFlavour, selectedSize, cakeMessage, unitPrice, qty]);

  function handleAdd() {
    add(itemPayload);
    setAdded(true); // Sets the button to "✓ Added to Order"
  }

  // 👇 FIX 2: Clear cart before adding, so "Buy Now" only buys this cake
  function handleBuyNow() {
    clear(); 
    add(itemPayload);
    router.push('/checkout');
  }

  // Handle File Upload to Supabase Storage
  async function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please upload an image under 5MB.');
      return;
    }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `design-${Date.now()}.${ext}`;

    const { error } = await sb.storage.from('customer-designs').upload(fileName, file);
    
    if (error) {
      alert(`Upload failed: ${error.message}`);
    } else {
      const { data: { publicUrl } } = sb.storage.from('customer-designs').getPublicUrl(fileName);
      setCustomDesignUrl(publicUrl);
    }
    setUploading(false);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16 pb-28 md:pb-16">
      <div className="grid gap-10 md:grid-cols-2">
        
        {/* LEFT: Image Gallery & Thumbnails */}
        <div className="space-y-4">
          <ImageSlideshow 
            images={product.images.map((img: any) => img.url)} 
            alt={product.name} 
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square overflow-hidden rounded-lg bg-cream-dark ring-2 transition-all ${
                    activeImageIndex === i ? 'ring-burgundy scale-95 shadow-sm' : 'ring-transparent hover:ring-olive/50'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Details */}
        <div>
          <h1 className="font-display text-3xl md:text-4xl text-ink">{product.name}</h1>
          
          {product.images.length > 1 && selectedImageObj?.label && (
            <p className="mt-1 text-sm font-medium text-burgundy">Selected: {selectedImageObj.label}</p>
          )}

          {product.short_desc && <p className="mt-2 text-olive-dark">{product.short_desc}</p>}

          <div className="mt-6 text-3xl font-display text-burgundy">{PKR(unitPrice)}</div>

          {/* Size, Variant, Flavour Selectors */}
          {product.allows_size && product.sizes.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-ink">Size / weight</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: any) => (
                  <button key={s.id} onClick={() => setSizeId(s.id)} className={`rounded-full border px-4 py-2 text-sm transition ${sizeId === s.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark'}`}>
                    {s.label} · {PKR(s.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.variants.length > 0 && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-ink">Type</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button key={v.id} onClick={() => setVariantId(v.id)} className={`rounded-full border px-4 py-2 text-sm transition ${variantId === v.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark'}`}>
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

          {/* Cake Message */}
          {product.allows_cake_message && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Cake message <span className="text-olive-dark text-xs">(max 30 chars)</span>
              </label>
              <input type="text" maxLength={30} value={cakeMessage} onChange={(e) => setCakeMessage(e.target.value)} placeholder="Happy Birthday, Sarah!" className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy" />
              
              {selectedImageObj && (
                <div className="mt-3 relative aspect-[3/1] overflow-hidden rounded-xl">
                  <img src={selectedImageObj.url} alt="" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-handwriting text-4xl text-cream drop-shadow-lg text-center px-4">{cakeMessage || 'Your message appears here'}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CUSTOM DESIGN UPLOAD */}
          <div className="mt-6 border-t border-olive/20 pt-6">
            <label className="block text-sm font-medium mb-2 text-ink">
              Upload your own design <span className="text-olive-dark text-xs">(Optional)</span>
            </label>
            
            {customDesignUrl ? (
              <div className="relative aspect-[4/3] w-full max-w-[200px] overflow-hidden rounded-xl ring-1 ring-burgundy/20">
                <img src={customDesignUrl} alt="Custom design" className="h-full w-full object-cover" />
                <button onClick={() => setCustomDesignUrl(null)} className="absolute top-2 right-2 rounded-full bg-burgundy px-2 py-1 text-xs text-cream hover:bg-burgundy-dark">Remove</button>
              </div>
            ) : (
              <label className="flex h-24 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-olive/30 bg-cream-card hover:bg-cream-dark/30 transition">
                <span className="text-sm text-olive-dark">{uploading ? 'Uploading...' : 'Click to upload a photo'}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleDesignUpload} disabled={uploading} />
              </label>
            )}
          </div>

          {/* DESKTOP ADD TO CART */}
          <div className="mt-8 hidden md:flex items-center gap-4">
            <div className="flex items-center rounded-full border border-olive/30 bg-cream-card">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-olive-dark hover:text-burgundy">−</button>
              <span className="w-6 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-olive-dark hover:text-burgundy">+</button>
            </div>
            
            {/* 👇 Button stays green if added, resets to burgundy if changed */}
            <button onClick={handleAdd} className={`flex-1 rounded-full px-6 py-3.5 text-cream font-medium shadow transition-colors ${
              added ? 'bg-olive' : 'bg-burgundy hover:bg-burgundy-dark'
            }`}>
              {added ? '✓ Added to Order' : `Add to Order · ${PKR(unitPrice * qty)}`}
            </button>
          </div>
          
          <button onClick={handleBuyNow} className="mt-3 w-full hidden md:block rounded-full border border-olive px-6 py-3.5 text-olive-dark font-medium hover:bg-olive hover:text-cream transition">
            Buy Now
          </button>

          {product.long_desc && (
            <div className="mt-8 border-t border-olive/20 pt-6">
              <h3 className="font-display text-lg text-ink">Details</h3>
              <p className="mt-2 text-sm text-olive-dark leading-relaxed whitespace-pre-line">{product.long_desc}</p>
            </div>
          )}
        </div>
      </div>

      {/* SMART UPSELLS */}
      {relatedProducts.length > 0 && (
        <div className="mt-20 pt-10 border-t border-olive/20">
          <div className="mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-ink">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      )}

      {/* PRODUCT REVIEWS */}
      {reviews.length > 0 && (
        <div className="mt-20 pt-10 border-t border-olive/20">
          <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">Customer Reviews</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((rev: any) => (
              <div key={rev.id} className="rounded-2xl bg-white/60 p-5 ring-1 ring-black/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-ink">{rev.customer_name}</span>
                  <span className="text-yellow-500 text-lg">
                    {'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}
                  </span>
                </div>
                {rev.comment && <p className="text-sm text-olive-dark italic">&quot;{rev.comment}&quot;</p>}
                <p className="text-xs text-olive-dark/60 mt-3">{new Date(rev.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MOBILE STICKY QUICK ADD BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-olive/20 bg-cream/95 p-3 px-4 backdrop-blur-md md:hidden shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto pr-14">
          <div className="flex items-center rounded-full border border-olive/30 bg-white">
            <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1.5 text-olive-dark">−</button>
            <span className="w-5 text-center text-sm font-medium">{qty}</span>
            <button onClick={() => setQty(q => q + 1)} className="px-3 py-1.5 text-olive-dark">+</button>
          </div>
          <button onClick={handleAdd} className={`flex-1 rounded-full px-4 py-3 text-sm text-cream font-medium shadow transition-colors ${
            added ? 'bg-olive' : 'bg-burgundy hover:bg-burgundy-dark'
          }`}>
            {added ? '✓ Added' : `Add · ${PKR(unitPrice * qty)}`}
          </button>
        </div>
      </div>
    </main>
  );
}