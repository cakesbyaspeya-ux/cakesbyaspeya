'use client';

import { useState } from 'react';

export function ReviewForm({ reference, productId, productName }: { reference: string; productId: string; productName: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reference,
        product_id: productId,
        customer_name: name || 'Anonymous',
        rating,
        comment
      }),
    });

    if (res.ok) {
      setSuccess(true);
    } else {
      alert('Failed to submit review.');
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="mt-4 rounded-xl bg-olive/10 p-4 text-center ring-1 ring-olive/20">
        <p className="text-sm font-medium text-olive-dark">🎉 Thank you for your review!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-cream-card p-5 ring-1 ring-black/5">
      <h3 className="font-display text-lg text-ink mb-2">Leave a Review for {productName}</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-ink mb-1">Your Name</label>
        <input required value={name} onChange={e => setName(e.target.value)} className="input" placeholder="e.g. Rahim" />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-ink mb-1">Rating</label>
        <div className="flex gap-1 text-2xl cursor-pointer">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
              <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-ink mb-1">Comment (Optional)</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)} className="input" rows={2} placeholder="How was the cake?" />
      </div>

      <button type="submit" disabled={loading} className="rounded-full bg-burgundy px-6 py-2 text-sm font-medium text-cream hover:bg-burgundy-dark transition disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
}
