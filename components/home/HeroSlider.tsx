'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type HeroSlide = {
  image: string;
  title: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

export function HeroSlider({ slides }: HeroSliderProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  const currentSlide = slides[active];

  return (
    <div className="relative mx-auto w-full max-w-xl animate-[fadeInUp_0.9s_ease-out_both]">
      <div
        aria-hidden="true"
        className="absolute -right-3 -top-3 h-24 w-24 rounded-full border border-burgundy/20 sm:-right-5 sm:-top-5 sm:h-32 sm:w-32"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-5 -left-5 h-32 w-32 rounded-full bg-olive/10 blur-2xl"
      />

      <div className="group relative aspect-[4/4.5] overflow-hidden rounded-[2rem] bg-cream-dark shadow-2xl shadow-olive/10 sm:rounded-[2.5rem]">
        {currentSlide ? (
          slides.map((slide, index) => (
            <div
              key={`${slide.image}-${index}`}
              aria-hidden={index !== active}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === active ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={`${slide.title} from Cakes by Aspeya`}
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition-transform duration-[6000ms] ease-out group-hover:scale-105"
              />
            </div>
          ))
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-4 bg-gradient-to-br from-cream-dark to-burgundy/10">
            <span className="text-8xl" aria-hidden="true">🎂</span>
            <p className="font-display text-xl text-olive-dark">Made with love</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/5" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-cream/80">
            Sweetness in every detail
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl">
            {currentSlide?.title || 'Your moment. Your cake.'}
          </h2>
          <Link
            href="/cakes"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cream transition-all hover:gap-4"
          >
            Find your favourite <span aria-hidden="true">→</span>
          </Link>

          {slides.length > 1 && (
            <div className="mt-5 flex items-center gap-2" aria-label="Hero slides">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.image}-dot-${index}`}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === active ? 'w-7 bg-cream' : 'w-2 bg-cream/50 hover:bg-cream/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="absolute -left-3 top-8 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md transition-transform duration-300 hover:-translate-y-1 sm:-left-8 sm:top-12 sm:px-5">
        <p className="font-display text-lg text-burgundy sm:text-xl">Made for you</p>
        <p className="mt-1 text-xs text-olive-dark">Every detail matters</p>
      </div>
    </div>
  );
}
