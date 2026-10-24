'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function ProductEditor({ product, images, sizes }: { product: any; images: any[]; sizes: any[] }) {
  const router = useRouter();
  const sb = createClient();
  
  // Form state
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

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  // Handle Image Upload
  async function handleImageUpload(slotIndex: number, file: File) {
    setUploadingImage(slotIndex);
    
    // 1. Upload to Supabase Storage
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

    // 2. Get Public URL
    const { data: { publicUrl } } = sb.storage.from('product-images').getPublicUrl(fileName);

    // 3. Save to database (product_images table)
    const existingImage = images.find(img => img.sort_order === slotIndex);
    
    if (existingImage) {
      await sb.from('product_images').update({ url: publicUrl }).eq('id', existingImage.id);
    } else {
      await sb.from('product_images').insert({
        product_id: product.id,
        url: publicUrl,
        sort_order: slotIndex
      });
    }

    setUploadingImage(null);
    router.refresh(); // Refresh to show new image
  }

  // Handle Delete Image
  async function handleRemoveImage(imageId: string) {
    if (!confirm('Remove this image?')) return;
    await sb.from('product_images').delete().eq('id', imageId);
    router.refresh();
  }

  // Handle Save
  async function handleSave() {
    setSaving(true);
    
    // 1. Update product details
    await sb.from('products').update({
      name: formData.name,
      short_desc: formData.short_desc,
      long_desc: formData.long_desc,
      is_active: formData.is_active,
      is_sold_out: formData.is_sold_out,
    }).eq('id', product.id);

    // 2. Update size prices
    for (const size of sizePrices) {
      await sb.from('product_sizes').update({ price: size.price }).eq('id', size.id);
    }

    setSaving(false);
    router.refresh();
    alert('Product saved successfully!');
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-ink">Edit: {product.name}</h1>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="rounded-full bg-burgundy px-6 py-2.5 text-sm font-medium text-cream hover:bg-burgundy-dark transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* BASIC INFO */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 space-y-4">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2">Basic Info</h2>
        
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Product Name</span>
          <input 
            type="text" 
            value={formData.name} 
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="input" 
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Short Description</span>
          <input 
            type="text" 
            value={formData.short_desc} 
            onChange={e => setFormData({ ...formData, short_desc: e.target.value })}
            className="input" 
            placeholder="e.g. Rich chocolate with fudge frosting"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Long Description</span>
          <textarea 
            value={formData.long_desc} 
            onChange={e => setFormData({ ...formData, long_desc: e.target.value })}
            className="input" 
            rows={4}
          />
        </label>

        <div className="flex gap-6 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_active} 
              onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              className="accent-burgundy w-4 h-4"
            />
            <span className="text-sm font-medium">Active (visible on site)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.is_sold_out} 
              onChange={e => setFormData({ ...formData, is_sold_out: e.target.checked })}
              className="accent-burgundy w-4 h-4"
            />
            <span className="text-sm font-medium">Sold Out</span>
          </label>
        </div>
      </section>

      {/* IMAGES */}
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2 mb-4">Images (Up to 4)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map(slot => {
            const img = images.find(i => i.sort_order === slot);
            return (
              <div key={slot} className="relative aspect-square rounded-xl bg-cream-dark overflow-hidden ring-1 ring-black/5 flex flex-col items-center justify-center">
                {img ? (
                  <>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute top-2 right-2 bg-cream/90 hover:bg-burgundy hover:text-cream text-ink text-xs font-bold w-6 h-6 rounded-full transition"
                    >
                      ✕
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-cream-dark/50 transition">
                    <span className="text-2xl opacity-30 mb-1">🖼</span>
                    <span className="text-xs text-olive-dark font-medium">
                      {uploadingImage === slot ? 'Uploading...' : 'Upload'}
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(slot, file);
                      }}
                    />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SIZES & PRICES (Only for cakes) */}
      {sizes.length > 0 && (
        <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5">
          <h2 className="font-display text-xl border-b border-olive/20 pb-2 mb-4">Sizes & Prices</h2>
          <div className="space-y-3">
            {sizePrices.map((size, idx) => (
              <div key={size.id} className="flex items-center gap-4">
                <span className="w-20 text-sm font-medium text-ink">{size.label}</span>
                <div className="relative flex-1 max-w-[200px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-olive-dark">৳</span>
                  <input 
                    type="number" 
                    value={size.price}
                    onChange={e => {
                      const newPrices = [...sizePrices];
                      newPrices[idx].price = Number(e.target.value);
                      setSizePrices(newPrices);
                    }}
                    className="input pl-8" 
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-olive-dark mt-4">* Leave a price as 0 to hide that size from customers.</p>
        </section>
      )}
    </div>
  );
}