'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { createClient } from '@/lib/supabase/client';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function CustomCakeClient({ product }: { product: any }) {
  const router = useRouter();
  const { add } = useCart();
  const sb = createClient();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [variantId, setVariantId] = useState<string>(product.variants[0]?.id || '');
  const [sizeId, setSizeId] = useState<string>(product.sizes.find((s: any) => s.is_default)?.id || product.sizes[0]?.id);
  const [flavourId, setFlavourId] = useState<string>(product.flavours[0]?.id || '');
  const [qty, setQty] = useState(1);

  // ── Selected Options ──
  const selectedVariant = product.variants.find((v: any) => v.id === variantId);
  const selectedSize = product.sizes.find((s: any) => s.id === sizeId);
  const selectedFlavour = product.flavours.find((f: any) => f.id === flavourId);

  // ── Extras ──
  const occasionExtra = selectedVariant ? Number(selectedVariant.price_delta) : 0;
  const flavourExtra = selectedFlavour ? Number(selectedFlavour.price_delta) : 0;
  const customDesignFee = product.base_price; 

  // ── Calculate Final Price for the Selected Size ──
  const basePrice = selectedSize ? Number(selectedSize.price) : 0;
  const unitPrice = basePrice + occasionExtra + flavourExtra + customDesignFee;
  const totalPrice = unitPrice * qty;

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File must be under 5MB.');

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `custom-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('customer-designs').upload(fileName, file);
    
    if (!error) {
      const { data: { publicUrl } } = sb.storage.from('customer-designs').getPublicUrl(fileName);
      setImageUrl(publicUrl);
    } else {
      alert('Upload failed. Please try again.');
    }
    setUploading(false);
  }

  function handleAddToCart() {
    if (!imageUrl) return alert('Please upload a design first.');

    add({
      product_id: product.id,
      product_slug: 'custom-cake',
      product_name: `Custom Cake (${selectedVariant?.name || 'Custom'})`,
      image: imageUrl,
      design_label: 'Custom Upload',
      custom_design_url: imageUrl,
      size_label: selectedSize?.label,
      flavour: selectedFlavour?.name,
      unit_price: unitPrice, 
      qty: qty,
    });

    router.push('/cart');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Create Your Custom Cake</h1>
        <p className="text-olive-dark max-w-xl mx-auto text-sm sm:text-base">
          Upload a reference photo and configure your cake below. The price is calculated automatically based on your selections.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        
        {/* Upload Area */}
        <div className="rounded-3xl bg-cream-card p-6 ring-1 ring-black/5 flex flex-col items-center justify-center min-h-[300px]">
          {imageUrl ? (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
              <img src={imageUrl} alt="Custom Design" className="h-full w-full object-cover" />
              <button onClick={() => setImageUrl(null)} className="absolute top-2 right-2 bg-burgundy text-cream px-3 py-1.5 rounded-full text-xs font-bold shadow">Remove</button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-cream-dark/30 transition rounded-2xl border-2 border-dashed border-olive/30 py-12">
              <span className="text-5xl mb-4">🖼️</span>
              <span className="text-lg font-medium text-ink">{uploading ? 'Uploading...' : 'Click to upload a photo'}</span>
              <span className="text-xs text-olive-dark mt-2">JPG, PNG up to 5MB</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          )}
        </div>

        {/* Options Area */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Occasion</label>
            <select value={variantId} onChange={(e) => setVariantId(e.target.value)} className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy">
              {product.variants.map((v: any) => (
                <option key={v.id} value={v.id}>
                  {v.name} {v.price_delta > 0 ? `(+${PKR(v.price_delta)})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Size / Weight</label>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s: any) => {
                // 👇 Dynamically calculate the price for EACH size button
                const dynamicSizeTotal = Number(s.price) + occasionExtra + flavourExtra + customDesignFee;
                
                return (
                  <button 
                    key={s.id} 
                    type="button" 
                    onClick={() => setSizeId(s.id)} 
                    className={`rounded-full border px-4 py-2 text-sm transition ${sizeId === s.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark hover:border-olive'}`}
                  >
                    {s.label} · {PKR(dynamicSizeTotal)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Flavour</label>
            <select value={flavourId} onChange={(e) => setFlavourId(e.target.value)} className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy">
              {product.flavours.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.name} {f.price_delta > 0 ? `(+${PKR(f.price_delta)})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Quantity</label>
            <div className="flex items-center rounded-full border border-olive/30 bg-cream-card w-fit">
              <button type="button" onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-2 text-olive-dark hover:text-burgundy">−</button>
              <span className="w-6 text-center text-sm font-medium">{qty}</span>
              <button type="button" onClick={() => setQty(q => q + 1)} className="px-4 py-2 text-olive-dark hover:text-burgundy">+</button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="rounded-2xl bg-white p-5 border border-olive/10 shadow-sm mt-6">
            <h3 className="font-display text-lg text-ink mb-3 border-b border-olive/10 pb-2">Price Breakdown</h3>
            <div className="space-y-2 text-sm text-olive-dark">
              <div className="flex justify-between">
                <span>Base Size ({selectedSize?.label})</span>
                <span>{PKR(basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Custom Design Fee</span>
                <span>{PKR(customDesignFee)}</span>
              </div>
              {occasionExtra > 0 && (
                <div className="flex justify-between">
                  <span>Occasion ({selectedVariant?.name})</span>
                  <span>{PKR(occasionExtra)}</span>
                </div>
              )}
              {flavourExtra > 0 && (
                <div className="flex justify-between">
                  <span>Flavour ({selectedFlavour?.name})</span>
                  <span>{PKR(flavourExtra)}</span>
                </div>
              )}
              <div className="flex justify-between font-medium text-ink pt-2 border-t border-olive/10">
                <span>Price per cake</span>
                <span>{PKR(unitPrice)}</span>
              </div>
              <div className="flex justify-between text-lg font-display text-burgundy pt-1">
                <span>Total</span>
                <span>{PKR(totalPrice)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart} 
              disabled={!imageUrl}
              className="mt-5 w-full rounded-full bg-burgundy px-6 py-3.5 text-cream font-medium shadow hover:bg-burgundy-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {imageUrl ? 'Add Custom Cake to Order' : 'Upload a design to continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}