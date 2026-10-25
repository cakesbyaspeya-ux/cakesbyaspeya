export default function ProductLoading() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <div className="grid gap-10 md:grid-cols-2">
        {/* Gallery Skeleton */}
        <div className="space-y-4">
          <div className="aspect-square w-full animate-pulse rounded-2xl bg-cream-dark" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-lg bg-cream-dark" />
            ))}
          </div>
        </div>

        {/* Details Skeleton */}
        <div className="space-y-6">
          <div className="h-10 w-2/3 animate-pulse rounded-lg bg-cream-dark" />
          <div className="h-6 w-1/3 animate-pulse rounded-lg bg-cream-dark" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-cream-dark" />
          <div className="h-12 w-1/2 animate-pulse rounded-full bg-cream-dark" />
        </div>
      </div>
    </main>
  );
}