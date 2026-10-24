'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Props = {
  images: string[];
  alt: string;
  autoMs?: number;
  currentIndex: number;                   // <-- Added: Parent controls index
  onIndexChange: (index: number) => void; // <-- Added: Parent updates index
};

export function ImageSlideshow({ images, alt, autoMs = 3500, currentIndex, onIndexChange }: Props) {
  const [paused, setPaused] = useState(false);
  const multiple = images.length > 1;

  // Auto-advance timer
  useEffect(() => {
    if (!multiple || paused) return;
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      onIndexChange(nextIndex);
    }, autoMs);
    return () => clearInterval(timer);
  }, [multiple, paused, images.length, autoMs, currentIndex, onIndexChange]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-cream-dark">
        <span className="text-6xl opacity-30">🎂</span>
      </div>
    );
  }

  if (!multiple) {
    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-dark">
        <Image src={images[0]} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-dark"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, idx) => (
        <Image
          key={src + idx}
          src={src}
          alt={`${alt} — view ${idx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-700 ease-in-out ${
            idx === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onIndexChange(idx)}
            aria-label={`Show image ${idx + 1}`}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'w-5 bg-cream' : 'w-2 bg-cream/60 hover:bg-cream/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}