'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function TrackOrderWidget() {
  const [ref, setRef] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    const cleanRef = ref.trim().toUpperCase();
    
    if (!cleanRef) {
      setError('Please enter an order reference.');
      return;
    }

    // Basic validation to ensure it looks like CBA-1234567
    if (!cleanRef.startsWith('CBA-')) {
      setError('Reference must start with CBA- (e.g. CBA-9380323)');
      return;
    }

    // Redirect to the tracking page
    router.push(`/track/${cleanRef}`);
  }

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
      <div className="rounded-3xl bg-cream-dark p-8 md:p-12 text-center ring-1 ring-black/10 shadow-sm flex flex-col items-center">
        <div className="text-4xl mb-4">📦</div>
        <h2 className="font-display text-3xl text-ink">Track Your Order</h2>
        <p className="mt-2 text-olive-dark text-sm max-w-md mx-auto">
          Enter your Order Reference number (e.g., CBA-9380323) to see your cake's current status.
        </p>
        
        <form onSubmit={handleTrack} className="mt-6 flex flex-col sm:flex-row w-full max-w-md gap-3">
          <input
            type="text"
            placeholder="CBA-1234567"
            value={ref}
            onChange={(e) => {
              setRef(e.target.value);
              setError('');
            }}
            className="input flex-1 text-center sm:text-left bg-white"
          />
          <button 
            type="submit" 
            className="rounded-xl bg-burgundy px-8 py-2.5 text-cream font-medium hover:bg-burgundy-dark transition shadow-sm"
          >
            Track
          </button>
        </form>
        
        {error && (
          <p className="mt-3 text-sm text-burgundy font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}