import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🍰</div>
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-4">Oops! This cake got eaten.</h1>
      <p className="text-olive-dark max-w-md mx-auto mb-8">
        We couldn&apos;t find the page you were looking for. It might have been moved, or it never existed.
      </p>
      <Link 
        href="/" 
        className="rounded-full bg-burgundy px-8 py-3 text-cream font-medium shadow hover:bg-burgundy-dark transition hover:-translate-y-0.5"
      >
        Back to Home
      </Link>
    </div>
  );
}