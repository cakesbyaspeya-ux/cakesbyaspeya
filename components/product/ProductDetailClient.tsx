'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { DesignSelector } from './DesignSelector';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function ProductDetailClient({ product, relatedProducts = [], reviews = [] }: { product: any, relatedProducts?: any[], reviews?: any[] }) {
  const router = useRouter();
  const { add, clear } = useCart();
  const sb = createClient();

  // Flow State
  const [step, setStep] = useState<1 | 2>(1);
  
  // Selections
  const [activeImageIndex, setActiveImageIndex] = useState(0); 
  const [customDesignUrl, setCustomDesignUrl] = useState<string | null>(null);
  const [sizeId, setSizeId] = useState<string | null>(product.sizes.find((s: any) => s.is_default)?.id ?? product.sizes[0]?.id ?? null);
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null);
  const [flavourId, setFlavourId] = useState<string | null>(product.flavours[0]?.id ?? null);
  const [cakeMessage, setCakeMessage] = useState('');
  const [qty, setQty] = useState(1);
  
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  const selectedSize = product.sizes.find((s: any) => s.id === sizeId);
  const selectedVariant = product.variants.find((v: any) => v.id === variantId);
  const selectedFlavour = product.flavours.find((f: any) => f.id === flavourId);
  
  // If they uploaded a custom design, use that. Otherwise use the selected catalogue image.
  const selectedImageObj = customDesignUrl 
    ? { id: 'custom', url: customDesignUrl, label: 'Custom Upload' } 
    : (product.images[activeImageIndex] || product.images[0]);

  const unitPrice = useMemo(() => {
    let price = selectedSize?.price ?? product.base_price ?? 0;
    if (selectedVariant?.price_delta) price += selectedVariant.price_delta;
    if (selectedFlavour?.price_delta) price += selectedFlavour.price_delta;
    return price;
  }, [selectedSize, selectedVariant, selectedFlavour, product.base_price]);

  async function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return alert('File must be under 5MB.');

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `custom-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('customer-designs').upload(fileName, file);
    
    if (!error) {
      const { data: { publicUrl } } = sb.storage.from('customer-designs').getPublicUrl(fileName);
      setCustomDesignUrl(publicUrl);
      setStep(2); // Automatically move to step 2 after upload
    }
    setUploading(false);
  }

  function handleNextStep() {
    if (!customDesignUrl && product.images.length === 0) {
      return alert('Please select a design or upload your own.');
    }
    setStep(2);
  }

  function handleAdd() {
    const payload = {
      product_id: product.id, product_slug: product.slug, product_name: product.name,
      image: selectedImageObj?.url || '',
      design_id: selectedImageObj?.id || null, design_label: selectedImageObj?.label || null,
      custom_design_url: customDesignUrl,
      variant: selectedVariant?.name ?? null, flavour: selectedFlavour?.name ?? null,
      size_label: selectedSize?.label ?? null, cake_message: cakeMessage.trim() || null,
      unit_price: unitPrice, qty,
    };
    add(payload);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    clear(); 
    const payload = {
      product_id: product.id, product_slug: product.slug, product_name: product.name,
      image: selectedImageObj?.url || '', design_id: selectedImageObj?.id || null, design_label: selectedImageObj?.label || null,
      custom_design_url: customDesignUrl, variant: selectedVariant?.name ?? null, flavour: selectedFlavour?.name ?? null,
      size_label: selectedSize?.label ?? null, cake_message: cakeMessage.trim() || null, unit_price: unitPrice, qty,
    };
    add(payload);
    router.push('/checkout/info');
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16 pb-28 md:pb-16">
      
      {/* STEP 1: CHOOSE DESIGN */}
      {step === 1 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl md:text-5xl text-ink mb-3">{product.name}</h1>
            <p className="text-olive-dark max-w-xl mx-auto">Choose one of our signature designs below, or upload your own inspiration.</p>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-xl mb-4 text-ink flex items-center gap-2"><span className="bg-burgundy text-cream w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> Select a Design</h2>
            <DesignSelector 
              images={product.images} 
              activeIndex={activeImageIndex} 
              onIndexChange={(idx) => { setCustomDesignUrl(null); setActiveImageIndex(idx); }} 
            />
          </div>

          <div className="mb-10">
            <h2 className="font-display text-xl mb-4 text-ink flex items-center gap-2"><span className="bg-burgundy text-cream w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> Or Upload Your Own</h2>
            {customDesignUrl ? (
              <div className="relative inline-block aspect-[4/3] w-full max-w-sm rounded-2xl overflow-hidden ring-2 ring-burgundy shadow-md">
                <img src={customDesignUrl} alt="Custom" className="w-full h-full object-cover" />
                <button onClick={() => setCustomDesignUrl(null)} className="absolute top-2 right-2 bg-burgundy text-cream px-3 py-1 rounded-full text-xs font-bold shadow">Remove</button>
              </div>
            ) : (
              <label className="flex w-full max-w-sm cursor-pointer items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-olive/30 bg-white/50 py-10 hover:bg-cream-dark/30 transition">
                <span className="text-3xl">🖼️</span>
                <div className="text-left">
                  <span className="block text-sm font-bold text-ink">{uploading ? 'Uploading...' : 'Upload your design'}</span>
                  <span className="block text-xs text-olive-dark mt-0.5">JPG, PNG up to 5MB</span>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleDesignUpload} disabled={uploading} />
              </label>
            )}
          </div>

          <div className="flex justify-center mt-12">
            <button 
              onClick={handleNextStep}
              className="rounded-full bg-burgundy px-10 py-4 text-lg font-medium text-cream shadow-lg hover:bg-burgundy-dark hover:-translate-y-0.5 transition-all w-full sm:w-auto"
            >
              Next: Customize Cake →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CUSTOMIZE CAKE */}
      {step === 2 && (
        <div className="animate-in fade-in slide-in-from-right-8 duration-500 grid gap-10 md:grid-cols-2">
          {/* Left: Visual Recap */}
          <div className="space-y-4">
             <button onClick={() => setStep(1)} className="text-sm font-medium text-olive-dark hover:text-burgundy mb-2 inline-block">← Change Design</button>
             <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-cream-dark border border-olive/10 shadow-sm">
                <img src={selectedImageObj?.url} alt="" className="h-full w-full object-cover" />
                {customDesignUrl && <span className="absolute top-4 left-4 bg-burgundy text-cream text-xs font-bold px-3 py-1 rounded-full">Your Upload</span>}
             </div>
          </div>

          {/* Right: Form */}
          <div>
            <h1 className="font-display text-3xl text-ink">{product.name}</h1>
            <div className="mt-4 text-3xl font-display text-burgundy">{PKR(unitPrice)}</div>

            {product.allows_size && product.sizes.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium mb-2 text-ink">Size / weight</label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s: any) => (
                    <button type="button" key={s.id} onClick={() => setSizeId(s.id)} className={`rounded-full border px-4 py-2 text-sm transition ${sizeId === s.id ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark'}`}>
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

            {product.allows_cake_message && (
              <div className="mt-5">
                <label className="block text-sm font-medium mb-2 text-ink">Cake message <span className="text-olive-dark text-xs">(max 30 chars)</span></label>
                <input type="text" maxLength={30} value={cakeMessage} onChange={(e) => setCakeMessage(e.target.value)} placeholder="Happy Birthday, Sarah!" className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy" />
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