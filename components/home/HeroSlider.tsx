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
    <div
      className="
        relative mx-auto w-full min-w-0
        max-w-xl px-2
        animate-[fadeInUp_0.9s_ease-out_both]
        motion-reduce:animate-none
        sm:px-0
      "
    >
      {/* Decorative circle */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -right-1 -top-2
          h-16 w-16 rounded-full
          border border-burgundy/20
          sm:-right-5 sm:-top-5
          sm:h-32 sm:w-32
        "
      />

      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-3 -left-1
          h-24 w-24 rounded-full
          bg-olive/10 blur-2xl
          sm:-bottom-5 sm:-left-5
          sm:h-32 sm:w-32
        "
      />

      {/* Main slider */}
      <div
        className="
          group relative isolate
          aspect-[4/4.8] overflow-hidden
          rounded-[1.5rem]
          bg-cream-dark
          shadow-xl shadow-olive/10
          sm:aspect-[4/4.5]
          sm:rounded-[2.5rem]
          sm:shadow-2xl
        "
      >
        {currentSlide ? (
          slides.map((slide, index) => (
            <div
              key={`${slide.image}-${index}`}
              aria-hidden={index !== active}
              className={`
                absolute inset-0
                transition-opacity duration-700
                motion-reduce:transition-none
                ${
                  index === active
                    ? 'z-10 opacity-100'
                    : 'pointer-events-none z-0 opacity-0'
                }
              `}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={
                  index === active
                    ? `${slide.title} from Cakes by Aspeya`
                    : ''
                }
                fetchPriority={index === 0 ? 'high' : 'auto'}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                className="
                  h-full w-full object-cover
                  transition-transform duration-[6000ms]
                  ease-out
                  motion-reduce:transition-none
                  sm:group-hover:scale-105
                "
              />
            </div>
          ))
        ) : (
          <div
            className="
              flex h-full flex-col items-center
              justify-center gap-3
              bg-gradient-to-br
              from-cream-dark to-burgundy/10
            "
          >
            <span
              className="text-6xl sm:text-8xl"
              aria-hidden="true"
            >
              🎂
            </span>

            <p
              className="
                font-display text-lg
                text-olive-dark sm:text-xl
              "
            >
              Made with love
            </p>
          </div>
        )}

        {/* Image overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 z-20
            bg-gradient-to-t
            from-ink/80 via-ink/10 to-ink/5
          "
        />

        {/* Content */}
        <div
          className="
            absolute inset-x-0 bottom-0 z-30
            p-4 pb-5 text-cream
            sm:p-8
          "
        >
          <p
            className="
              text-[10px] font-medium uppercase
              tracking-[0.16em] text-cream/85
              sm:text-xs sm:tracking-[0.25em]
            "
          >
            Sweetness in every detail
          </p>

          <h2
            className="
              mt-2 max-w-full
              break-words font-display
              text-2xl leading-tight
              sm:text-4xl sm:leading-tight
            "
          >
            {currentSlide?.title || 'Your moment. Your cake.'}
          </h2>

          <Link
            href="/cakes"
            className="
              mt-3 inline-flex min-h-11
              items-center gap-2
              rounded-lg text-sm font-medium
              text-cream transition-[gap]
              duration-300
              hover:gap-3
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-cream
              focus-visible:ring-offset-2
              focus-visible:ring-offset-ink
              sm:mt-4 sm:hover:gap-4
            "
          >
            Find your favourite
            <span aria-hidden="true">→</span>
          </Link>

          {/* Slide indicators */}
          {slides.length > 1 && (
            <div
              className="mt-3 flex min-h-11 items-center gap-1 sm:mt-4 sm:gap-2"
              role="group"
              aria-label="Choose a hero slide"
            >
              {slides.map((slide, index) => (
                <button
                  key={`${slide.image}-dot-${index}`}
                  type="button"
                  aria-label={`Show slide ${index + 1}: ${slide.title}`}
                  aria-pressed={index === active}
                  onClick={() => setActive(index)}
                  className="
                    flex h-11 min-w-8
                    items-center justify-center
                    rounded-full
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cream
                  "
                >
                  <span
                    aria-hidden="true"
                    className={`
                      block h-2 rounded-full
                      transition-[width,background-color]
                      duration-300
                      motion-reduce:transition-none
                      ${
                        index === active
                          ? 'w-7 bg-cream'
                          : 'w-2 bg-cream/60'
                      }
                    `}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating badge */}
      <div
        className="
          absolute left-3 top-4 z-40
          max-w-[calc(100%-2rem)]
          rounded-xl border border-white/70
          bg-white/95 px-3 py-2
          shadow-lg backdrop-blur-md
          sm:-left-8 sm:top-12
          sm:rounded-2xl sm:px-5 sm:py-3
        "
      >
        <p className="font-display text-base text-burgundy sm:text-xl">
          Made for you
        </p>

        <p className="mt-0.5 text-[10px] text-olive-dark sm:mt-1 sm:text-xs">
          Every detail matters
        </p>
      </div>
    </div>
  );
}