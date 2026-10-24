'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ImageSlideshow } from './ImageSlideshow';
import { useCart } from '@/components/cart/CartProvider';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { add } = useCart();

  // --- State ---
  const [sizeId, setSizeId] = useState<string | null>(
    product.sizes.find((s: any) => s.is_default)?.id ?? product.sizes[0]?.id ?? null
  );
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null);
  const [flavourId, setFlavourId] = useState<string | null>(product.flavours[0]?.id ?? null);
  const [cakeMessage, setCakeMessage] = useState('');
  const [qty, setQty] = useState(1);
  
  // NEW: Track exactly which image design is selected
  const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const [added, setAdded] = useState(false);

  // --- Derived Data ---
  const selectedSize = product.sizes.find((s: any) => s.id === sizeId);
  const selectedVariant = product.variants.find((v: any) => v.id === variantId);
  const selectedFlavour = product.flavours.find((f: any) => f.id === flavourId);
  
  // Get the exact image object the user is looking at
  const selectedImageObj = product.images[activeImageIndex] || product.images[0];

  // Live price calculation
  const unitPrice = useMemo(() => {
    let price = selectedSize?.price ?? product.base_price ?? 0;
    if (selectedVariant?.price_delta) price += selectedVariant.price_delta;
    if (selectedFlavour?.price_delta) price += selectedFlavour.price_delta;
    return price;
  }, [selectedSize, selectedVariant, selectedFlavour, product.base_price]);

  function handleAdd() {
    add({
      product_id: product.id,
      product_slug: product.slug,
      product_name: product.name,
      image: selectedImageObj?.url || '',
      // Pass the design ID and Label to the cart so they are unique per design
      design_id: selectedImageObj?.id || null,
      design_label: selectedImageObj?.label || null,
      
      variant: selectedVariant?.name ?? null,
      flavour: selectedFlavour?.name ?? null,
      size_label: selectedSize?.label ?? null,
      cake_message: cakeMessage.trim() || null,
      unit_price: unitPrice,
      qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        
        {/* LEFT: Image Gallery & Thumbnails */}
        <div className="space-y-4">
          {/* Main Slideshow (Synced with activeImageIndex) */}
          <ImageSlideshow 
            images={product.images.map((img: any) => img.url)} 
            alt={product.name} 
            activeIndex={activeImageIndex}
            onIndexChange={setActiveImageIndex}
          />
          
          {/* Clickable Thumbnails */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square overflow-hidden rounded-lg bg-cream-dark ring-2 transition-all ${
                    activeImageIndex === i 
                      ? 'ring-burgundy scale-95 shadow-sm' 
                      : 'ring-transparent hover:ring-olive/50'
                  }`}
                  title={img.label}
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
          
          {/* Display the active design label if there are multiple images */}
          {product.images.length > 1 && selectedImageObj?.label && (
            <p className="mt-1 text-sm font-medium text-burgundy">
              Selected: {selectedImageObj.label}
            </p>
          )}

          {product.short_desc && <p className="mt-2 text-olive-dark">{product.short_desc}</p>}

          <div className="mt-6 text-3xl font-display text-burgundy">{PKR(unitPrice)}</div>

          {/* Sizes */}
          {product.allows_size && product.sizes.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2 text-ink">Size / weight</label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s: any) => (
                  <button
                    key={s.id}
                    onClick={() => setSizeId(s.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      sizeId === s.id
                        ? 'border-burgundy bg-burgundy text-cream'
                        : 'border-olive/30 text-olive-dark hover:border-olive'
                    }`}
                  >
                    {s.label} · {PKR(s.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variants */}
          {product.variants.length > 0 && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-ink">Type</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition ${
                      variantId === v.id
                        ? 'border-burgundy bg-burgundy text-cream'
                        : 'border-olive/30 text-olive-dark hover:border-olive'
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavours */}
          {product.allows_flavour && product.flavours.length > 0 && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-ink">Flavour</label>
              <select
                value={flavourId ?? ''}
                onChange={(e) => setFlavourId(e.target.value || null)}
                className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy"
              >
                {product.flavours.map((f: any) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cake Message & Live Preview */}
          {product.allows_cake_message && (
            <div className="mt-5">
              <label className="block text-sm font-medium mb-2 text-ink">
                Cake message <span className="text-olive-dark text-xs">(max 30 chars)</span>
              </label>
              <input
                type="text"
                maxLength={30}
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                placeholder="Happy Birthday, Sarah!"
                className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy"
              />
              
              {selectedImageObj && (
                <div className="mt-3 relative aspect-[3/1] overflow-hidden rounded-xl">
                  <img src={selectedImageObj.url} alt="" className="h-full w-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-2xl text-cream drop-shadow-lg text-center px-4 italic">
                      {cakeMessage || 'Your message appears here'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-olive/30 bg-cream-card">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-olive-dark hover:text-burgundy">−</button>
              <span className="w-6 text-center text-sm font-medium">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-olive-dark hover:text-burgundy">+</button>
            </div>
            
            <button
              onClick={handleAdd}
              className="flex-1 rounded-full bg-burgundy px-6 py-3.5 text-cream font-medium shadow hover:bg-burgundy-dark transition"
            >
              {added ? '✓ Added to Order' : `Add to Order · ${PKR(unitPrice * qty)}`}
            </button>
          </div>
          
          <button
            onClick={() => { handleAdd(); router.push('/checkout'); }}
            className="mt-3 w-full rounded-full border border-olive px-6 py-3.5 text-olive-dark font-medium hover:bg-olive hover:text-cream transition"
          >
            Buy Now
          </button>

          {product.long_desc && (
            <div className="mt-8 border-t border-olive/20 pt-6">
              <h3 className="font-display text-lg text-ink">Details</h3>
              <p className="mt-2 text-sm text-olive-dark leading-relaxed whitespace-pre-line">
                {product.long_desc}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}