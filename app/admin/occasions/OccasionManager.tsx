'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';

export function OccasionManager({ initialOccasions }: { initialOccasions: any[] }) {
  const router = useRouter();
  const sb = createClient();
  const [occasions, setOccasions] = useState(initialOccasions);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleImageUpload(id: string, file: File) {
    setUploading(id);
    const ext = file.name.split('.').pop();
    const fileName = `occasion-${id}-${Date.now()}.${ext}`;

    const { error } = await sb.storage.from('occasion-images').upload(fileName, file);
    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(null);
      return;
    }

    const { data: { publicUrl } } = sb.storage.from('occasion-images').getPublicUrl(fileName);
    
    // Update local state
    const updated = occasions.map(o => o.id === id ? { ...o, image_url: publicUrl } : o);
    setOccasions(updated);

    // Update database
    await sb.from('occasions').update({ image_url: publicUrl }).eq('id', id);
    
    setUploading(null);
    router.refresh();
  }

  async function handleRemoveImage(id: string) {
    if (!confirm('Remove this image?')) return;
    const updated = occasions.map(o => o.id === id ? { ...o, image_url: null } : o);
    setOccasions(updated);
    await sb.from('occasions').update({ image_url: null }).eq('id', id);
    router.refresh();
  }

  async function handleSaveDetails(id: string, title: string, subtitle: string) {
    setSaving(true);
    await sb.from('occasions').update({ title, subtitle }).eq('id', id);
    setSaving(false);
    router.refresh();
  }

  function updateOccasionField(id: string, field: 'title' | 'subtitle', value: string) {
    setOccasions((current) =>
      current.map((occasion) =>
        occasion.id === id ? { ...occasion, [field]: value } : occasion
      )
    );
  }

  return (
    <div className="space-y-4">
      {occasions.map((occasion) => (
        <div key={occasion.id} className="rounded-2xl bg-cream-card p-4 ring-1 ring-black/5 flex flex-col md:flex-row gap-6">
          
          {/* Image Upload Area */}
          <div className="w-full md:w-48 shrink-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-dark border border-olive/10 flex flex-col items-center justify-center">
              {occasion.image_url ? (
                <>
                  <Image src={occasion.image_url} alt={occasion.title} fill className="object-cover" />
                  <button onClick={() => handleRemoveImage(occasion.id)} className="absolute top-2 right-2 rounded-full bg-burgundy px-2 py-1 text-xs text-cream">✕</button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-cream-dark/50">
                  <span className="text-2xl mb-1">{occasion.symbol}</span>
                  <span className="text-xs font-medium text-olive-dark">{uploading === occasion.id ? 'Uploading...' : 'Upload Image'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(occasion.id, file);
                  }} />
                </label>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-medium text-olive-dark mb-1">Title</label>
              <input
                type="text"
                value={occasion.title ?? ''}
                onChange={(e) => updateOccasionField(occasion.id, 'title', e.target.value)}
                onBlur={() => handleSaveDetails(occasion.id, occasion.title ?? '', occasion.subtitle ?? '')}
                className="input py-2 text-sm font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-olive-dark mb-1">Subtitle</label>
              <input
                type="text"
                value={occasion.subtitle ?? ''}
                onChange={(e) => updateOccasionField(occasion.id, 'subtitle', e.target.value)}
                onBlur={() => handleSaveDetails(occasion.id, occasion.title ?? '', occasion.subtitle ?? '')}
                className="input py-2 text-sm text-olive-dark"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-olive-dark">Slug: /occasions/{occasion.slug}</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}