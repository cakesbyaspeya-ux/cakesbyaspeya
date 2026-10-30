'use client';

import Image from 'next/image';

type DesignImage = {
  id: string;
  url: string;
  label: string;
};

export function DesignSelector({ 
  images, 
  activeIndex, 
  onIndexChange 
}: { 
  images: DesignImage[]; 
  activeIndex: number; 
  onIndexChange: (index: number) => void; 
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img, i) => (
        <button
          type="button"
          key={img.id}
          onClick={() => onIndexChange(i)}
          className={`group relative aspect-square overflow-hidden rounded-2xl bg-cream-dark ring-2 transition-all ${
            activeIndex === i ? 'ring-burgundy scale-[0.98] shadow-md' : 'ring-transparent hover:ring-olive/50 hover:-translate-y-1'
          }`}
        >
          <Image src={img.url} alt={img.label} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          {activeIndex === i && (
            <div className="absolute inset-0 bg-burgundy/10 flex items-center justify-center">
              <span className="bg-burgundy text-cream text-xs font-bold px-3 py-1 rounded-full shadow-lg">Selected</span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
}