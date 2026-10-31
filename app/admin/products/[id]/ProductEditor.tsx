'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export function ProductEditor({ 
  product, 
  images, 
  sizes,
  allFlavours
}: { 
  product: any; 
  images: any[]; 
  sizes: any[];
  allFlavours: any[];
}) {
  const router = useRouter();
  const sb = createClient();
  
  const [formData, setFormData] = useState({
    name: product.name,
    short_desc: product.short_desc || '',
    long_desc: product.long_desc || '',
    is_active: product.is_active,
    is_sold_out: product.is_sold_out,
  });

  const [sizePrices, setSizePrices] = useState(
    sizes.sort((a, b) => a.sort_order - b.sort_order).map(s => ({ ...s }))
  );

  const [flavours, setFlavours] = useState<string[]>(
    (product.product_flavours ?? []).map((pf: any) => pf.flavour_id)
  );

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  // ── Image Handlers ──
  async function handleImageUpload(slotIndex: number, file: File) {
    setUploadingImage(slotIndex);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${product.id}-${slotIndex}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await sb.storage
      .from('product-images')
      .upload(fileName, file, { upsert: true });

    if (uploadError) {
      alert('Upload failed: ' + uploadError.message);
      setUploadingImage(null);
      return;
    }

    const { data: { publicUrl } } = sb.storage.from('product-images').getPublicUrl(fileName);

    const existingImage = images.find(img => img.sort_order === slotIndex);
    
    if (existingImage) {
      await sb.from('product_images').update({ url: publicUrl }).eq('id', existingImage.id);
    } else {
      await sb.from('product_images').insert({
        product_id: product.id,
        url: publicUrl,
        sort_order: slotIndex,
        size_prices: null
      });
    }

    setUploadingImage(null);
    router.refresh(); 
  }

  async function handleRemoveImage(imageId: string) {
    if (!confirm('Remove this image?')) return;
    await sb.from('product_images').delete().eq('id', imageId);
    router.refresh();
  }

  // 👇 Handler for Specific Design Prices 👇
  async function handleDesignPriceChange(imageId: string, sizeLabel: string, price: number, currentPrices: any) {
    const newPrices = { ...(currentPrices || {}) };
    
    if (price > 0) {
      newPrices[sizeLabel] = price;
    } else {
      delete newPrices[sizeLabel]; // If cleared, fallback to default size price
    }

    await sb.from('product_images').update({ size_prices: newPrices }).eq('id', imageId);
    router.refresh();
  }

  async function handleSave() {
    setSaving(true);
    
    await sb.from('products').update({
      name: formData.name,
      short_desc: formData.short_desc,
      long_desc: formData.long_desc,
      is_active: formData.is_active,
      is_sold_out: formData.is_sold_out,
    }).eq('id', product.id);

    for (const size of sizePrices) {
      await sb.from('product_sizes').update({ price: size.price }).eq('id', size.id);
    }

    await sb.from('product_flavours').delete().eq('product_id', product.id);
    if (flavours.length > 0) {
      await sb.from('product_flavours').insert(flavours.map(fid => ({ product_id: product.id, flavour_id: fid })));
    }

    setSaving(false);
    router.refresh();
    alert('Product saved successfully!');
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Edit: {product.name}</h1>
          <p className="text-sm text-olive-dark mt-1">Update images, prices, and details.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="rounded-full bg-burgundy px-8 py-3 text-sm font-medium text-cream shadow hover:bg-burgundy-dark transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* BASIC INFO */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 space-y-4">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2">Basic Info</h2>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Product Name</span>
          <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="input" />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Short Description</span>
          <input type="text" value={formData.short_desc} onChange={e => setFormData({ ...formData, short_desc: e.target.value })} className="input" placeholder="e.g. Rich chocolate with fudge frosting" />
        </label>
        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="accent-burgundy w-4 h-4" />
            <span className="text-sm font-medium">Active</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formData.is_sold_out} onChange={e => setFormData({ ...formData, is_sold_out: e.target.checked })} className="accent-burgundy w-4 h-4" />
            <span className="text-sm font-medium">Sold Out</span>
          </label>
        </div>
      </section>

      {/* IMAGES & SPECIFIC PRICES */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <div className="flex items-center justify-between border-b border-olive/20 pb-2 mb-4">
          <h2 className="font-display text-xl">Design Gallery & Prices</h2>
          <span className="text-xs font-medium text-olive-dark bg-olive/10 px-3 py-1 rounded-full">{images.length} / 20</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 20 }).map((_, slot) => {
            const img = images.find(i => i.sort_order === slot);
            return (
              <div key={slot} className="rounded-xl bg-cream-dark ring-1 ring-black/5 p-3 flex flex-col gap-3">
                
                {/* Image Upload Area */}
                <div className="relative aspect-square w-full rounded-lg overflow-hidden group">
                  {img ? (
                    <>
                      <Image src={img.url} alt={`Design ${slot + 1}`} fill className="object-cover" sizes="33vw" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button onClick={() => handleRemoveImage(img.id)} className="bg-burgundy text-cream px-3 py-1.5 rounded-full text-xs font-medium hover:bg-burgundy-dark">Remove</button>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">#{slot + 1}</span>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-cream-dark/50 transition">
                      <span className="text-xl opacity-30 mb-1">🖼</span>
                      <span className="text-[10px] text-olive-dark font-medium text-center">{uploadingImage === slot ? 'Uploading...' : `Upload Slot ${slot + 1}`}</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(slot, file);
                      }} />
                    </label>
                  )}
                </div>
                
                {/* Specific Size Prices for THIS design */}
                {img && (
                  <details className="text-xs bg-white rounded-lg border border-olive/10">
                    <summary className="cursor-pointer font-medium text-burgundy p-2">Set Specific Prices</summary>
                    <div className="p-2 space-y-2 border-t border-olive/10">
                      {sizes.map(s => (
                        <div key={s.id} className="flex items-center gap-2">
                          <span className="w-12 text-olive-dark font-medium">{s.label}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-olive-dark">৳</span>
                            <input 
                              type="number" 
                              defaultValue={img.size_prices?.[s.label] || ''}
                              placeholder={String(s.price)} // Shows base price as placeholder
                              onBlur={(e) => handleDesignPriceChange(img.id, s.label, Number(e.target.value), img.size_prices)}
                              className="w-full rounded border border-olive/20 pl-6 pr-1 py-1 text-xs outline-none focus:border-burgundy"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* DEFAULT SIZES & FLAVOURS */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2 mb-4">Default Size Prices (Fallback)</h2>
        <p className="text-xs text-olive-dark mb-4">If a design doesn't have specific prices set above, these default prices will be used.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {sizePrices.map((size, idx) => (
            <div key={size.id} className="flex items-center justify-between gap-4 bg-white/50 p-3 rounded-xl border border-olive/10">
              <span className="text-sm font-medium text-ink w-16">{size.label}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-dark">৳</span>
                <input type="number" value={size.price} onChange={e => {
                    const newPrices = [...sizePrices];
                    newPrices[idx].price = Number(e.target.value);
                    setSizePrices(newPrices);
                  }} className="input pl-8 py-2" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FLAVOURS */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2 mb-4">Available Flavours</h2>
        <div className="flex flex-wrap gap-2">
          {allFlavours.map((f: any) => {
            const isSelected = flavours.includes(f.id);
            return (
              <button key={f.id} type="button" onClick={() => {
                  if (isSelected) setFlavours(flavours.filter(id => id !== f.id));
                  else setFlavours([...flavours, f.id]);
                }} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${isSelected ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark hover:border-olive'}`}>
                {isSelected ? '✓ ' : '+ '}{f.name}
              </button>
            );
          })}
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button onClick={handleSave} disabled={saving} className="w-full sm:w-auto rounded-full bg-burgundy px-8 py-3.5 text-sm font-medium text-cream shadow hover:bg-burgundy-dark transition disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}