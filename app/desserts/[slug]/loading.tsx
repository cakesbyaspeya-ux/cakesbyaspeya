export default function CakesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-cream-dark" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-cream-dark" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="sticky top-16 z-30 mb-8 rounded-2xl bg-cream/90 p-3 md:p-4 backdrop-blur-md ring-1 ring-black/5 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 flex-1 animate-pulse rounded-xl bg-cream-dark" />
          <div className="h-10 w-[140px] animate-pulse rounded-xl bg-cream-dark" />
          <div className="h-10 w-[160px] animate-pulse rounded-xl bg-cream-dark" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl bg-white/60 ring-1 ring-black/5">
            <div className="aspect-square w-full animate-pulse bg-cream-dark" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 animate-pulse rounded bg-cream-dark" />
              <div className="flex justify-between">
                <div className="h-4 w-1/3 animate-pulse rounded bg-cream-dark" />
                <div className="h-4 w-1/4 animate-pulse rounded bg-cream-dark" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}