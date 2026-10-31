'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';
import { createClient } from '@/lib/supabase/client';

export default function CustomCakePage() {
  const router = useRouter();
  const { add } = useCart();
  const sb = createClient();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [occasion, setOccasion] = useState('Birthday');
  const [size, setSize] = useState('1 lb');
  const [flavour, setFlavour] = useState('Vanilla');
  const [qty, setQty] = useState(1);

  const SIZES = ['0.5 lb', '1 lb', '2 lb', '3 lb'];
  const FLAVOURS = ['Vanilla', 'Chocolate', 'Red Velvet', 'Pistachio', 'Mango'];
  const OCCASIONS = ['Birthday', "Anniversary", "Kid's Party", 'Just because'];

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
      product_id: 'custom-cake',
      product_slug: 'custom-cake',
      product_name: `Custom Cake (${occasion})`, // Add occasion to name
      image: imageUrl,
      design_label: 'Custom Upload',
      custom_design_url: imageUrl,
      size_label: size,
      flavour: flavour,
      unit_price: 0, 
      qty: qty,
    });

    router.push('/cart');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:py-20">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Upload Your Own Design</h1>
        <p className="text-olive-dark max-w-xl mx-auto text-sm sm:text-base">
          Have a specific cake in mind? Upload a reference photo and choose your base options. We will contact you on WhatsApp to confirm the final price.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
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

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Select Occasion</label>
            <select value={occasion} onChange={(e) => setOccasion(e.target.value)} className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy">
              {OCCASIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Select Size</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => setSize(s)} className={`rounded-full border px-4 py-2 text-sm transition ${size === s ? 'border-burgundy bg-burgundy text-cream' : 'border-olive/30 text-olive-dark'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-ink">Select Flavour</label>
            <select value={flavour} onChange={(e) => setFlavour(e.target.value)} className="w-full rounded-lg border border-olive/30 bg-cream-card px-4 py-2.5 outline-none focus:border-burgundy">
              {FLAVOURS.map((f) => <option key={f} value={f}>{f}</option>)}
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

          <div className="pt-4 border-t border-olive/20">
            <button onClick={handleAddToCart} className="w-full rounded-full bg-burgundy px-6 py-3.5 text-cream font-medium shadow hover:bg-burgundy-dark transition">
              Add Custom Cake to Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}