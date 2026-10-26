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

  // Upload main cover image
  async function handleCoverUpload(id: string, file: File) {
    setUploading(`cover-${id}`);
    const ext = file.name.split('.').pop();
    const fileName = `cover-${id}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('occasion-images').upload(fileName, file);
    if (!error) {
      const { data: { publicUrl } } = sb.storage.from('occasion-images').getPublicUrl(fileName);
      await sb.from('occasions').update({ image_url: publicUrl }).eq('id', id);
      setOccasions(occasions.map(o => o.id === id ? { ...o, image_url: publicUrl } : o));
      router.refresh();
    }
    setUploading(null);
  }

  // Upload gallery image
  async function handleGalleryUpload(id: string, file: File) {
    setUploading(`gallery-${id}`);
    const ext = file.name.split('.').pop();
    const fileName = `gallery-${id}-${Date.now()}.${ext}`;
    const { error } = await sb.storage.from('occasion-images').upload(fileName, file);
    
    if (!error) {
      const { data: { publicUrl } } = sb.storage.from('occasion-images').getPublicUrl(fileName);
      const occasion = occasions.find(o => o.id === id);
      const currentGallery = occasion.gallery || [];
      
      // Limit to 6 images for the gallery
      if (currentGallery.length >= 6) {
        alert('You can only upload up to 6 gallery images.');
        setUploading(null);
        return;
      }

      const newGallery = [...currentGallery, publicUrl];
      await sb.from('occasions').update({ gallery: newGallery }).eq('id', id);
      setOccasions(occasions.map(o => o.id === id ? { ...o, gallery: newGallery } : o));
      router.refresh();
    }
    setUploading(null);
  }

  // Remove gallery image
  async function removeGalleryImage(id: string, url: string) {
    const occasion = occasions.find(o => o.id === id);
    const newGallery = (occasion.gallery || []).filter((u: string) => u !== url);
    await sb.from('occasions').update({ gallery: newGallery }).eq('id', id);
    setOccasions(occasions.map(o => o.id === id ? { ...o, gallery: newGallery } : o));
    router.refresh();
  }

  async function handleSaveDetails(id: string, title: string, subtitle: string) {
    await sb.from('occasions').update({ title, subtitle }).eq('id', id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {occasions.map((occasion) => (
        <div key={occasion.id} className="rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main Cover Image */}
            <div className="w-full md:w-48 shrink-0">
              <span className="text-xs font-medium text-olive-dark mb-1 block">Main Category Image</span>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-dark border border-olive/10 flex flex-col items-center justify-center">
                {occasion.image_url ? (
                  <>
                    <Image src={occasion.image_url} alt={occasion.title} fill className="object-cover" />
                    <button onClick={() => sb.from('occasions').update({ image_url: null }).eq('id', occasion.id).then(() => router.refresh())} className="absolute top-2 right-2 rounded-full bg-burgundy px-2 py-1 text-xs text-cream">✕</button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-cream-dark/50">
                    <span className="text-2xl mb-1">{occasion.symbol}</span>
                    <span className="text-xs font-medium text-olive-dark">{uploading === `cover-${occasion.id}` ? 'Uploading...' : 'Upload Cover'}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCoverUpload(occasion.id, file);
                    }} />
                  </label>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="flex-1 space-y-3">
              <div>
                <label className="block text-xs font-medium text-olive-dark mb-1">Title</label>
                <input type="text" defaultValue={occasion.title} onBlur={(e) => handleSaveDetails(occasion.id, e.target.value, occasion.subtitle)} className="input py-2 text-sm font-medium" />
              </div>
              <div>
                <label className="block text-xs font-medium text-olive-dark mb-1">Subtitle</label>
                <input type="text" defaultValue={occasion.subtitle} onBlur={(e) => handleSaveDetails(occasion.id, occasion.title, e.target.value)} className="input py-2 text-sm text-olive-dark" />
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div className="border-t border-olive/10 pt-4">
            <span className="text-xs font-medium text-olive-dark mb-2 block">Sample Gallery Images (Max 6)</span>
            <div className="flex flex-wrap gap-3">
              {(occasion.gallery || []).map((url: string) => (
                <div key={url} className="relative h-20 w-20 rounded-lg overflow-hidden ring-1 ring-black/10">
                  <Image src={url} alt="Gallery" fill className="object-cover" />
                  <button onClick={() => removeGalleryImage(occasion.id, url)} className="absolute top-1 right-1 bg-burgundy text-cream text-[10px] rounded-full h-4 w-4 flex items-center justify-center">✕</button>
                </div>
              ))}
              {(occasion.gallery || []).length < 6 && (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-olive/30 bg-cream hover:bg-cream-dark transition">
                  <span className="text-xl text-olive-dark">+</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleGalleryUpload(occasion.id, file);
                  }} />
                </label>
              )}
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}