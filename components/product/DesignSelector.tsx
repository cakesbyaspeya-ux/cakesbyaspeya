'use client';

import { useState, useEffect } from 'react';
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
  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-cream-dark">
        <span className="text-6xl opacity-30">🎂</span>
      </div>
    );
  }

  const currentImage = images[activeIndex] || images[0];

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-dark border border-olive/10">
        <Image
          src={currentImage.url}
          alt={currentImage.label}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
          priority
        />
      </div>

      {/* Thumbnail Grid (up to 8 designs) */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              type="button"
              key={img.id}
              onClick={() => onIndexChange(i)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-cream-dark ring-2 transition-all ${
                activeIndex === i ? 'ring-burgundy scale-95 shadow-sm' : 'ring-transparent hover:ring-olive/50'
              }`}
            >
              <Image src={img.url} alt={img.label} fill className="object-cover" sizes="100px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}