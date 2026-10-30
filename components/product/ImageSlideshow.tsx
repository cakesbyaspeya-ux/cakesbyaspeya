// Replace the outer wrapper <div> and all internal "rounded-2xl" with:
<div
  className="relative aspect-[4/5] w-full overflow-hidden bg-[var(--color-cream-dark)]"
  onMouseEnter={() => setPaused(true)}
  onMouseLeave={() => setPaused(false)}
>
  {images.map((src, idx) => (
    <Image
      key={src + idx}
      src={src}
      alt={`${alt} — view ${idx + 1}`}
      fill
      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className={`object-cover transition-opacity duration-700 ease-in-out ${
        idx === current ? 'opacity-100' : 'opacity-0'
      }`}
    />
  ))}
  {/* dots — bottom-left, refined */}
  <div className="absolute bottom-2.5 left-3 flex gap-1">
    {images.map((_, idx) => (
      <button
        key={idx}
        type="button"
        onClick={() => changeIndex(idx)}
        aria-label={`Show image ${idx + 1}`}
        className={`h-1 rounded-full transition-all ${
          idx === current ? 'w-4 bg-white' : 'w-1 bg-white/60 hover:bg-white/85'
        }`}
      />
    ))}
  </div>
</div>