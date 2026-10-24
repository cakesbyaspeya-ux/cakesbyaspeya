import Link from 'next/link';

export const metadata = {
  title: 'Delivery & Ordering Policy',
};

export default function DeliveryPolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="font-display text-4xl text-ink md:text-5xl mb-6">Delivery & Ordering</h1>
      
      <div className="space-y-8 text-olive-dark">
        <section>
          <h2 className="font-display text-2xl text-ink mb-3">⏱ 24-Hour Notice</h2>
          <p>Because every cake is baked fresh to order, we require a minimum of <strong>24 hours advance notice</strong> for all orders. For large or highly customised cakes, we recommend ordering 2–3 days in advance.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">🚚 Delivery Areas</h2>
          <p>We deliver to all areas within <strong>Chittagong City</strong>. We do not currently deliver outside the city limits.</p>
          <p className="mt-2">Delivery fees depend on your specific area and will be confirmed with you directly on WhatsApp before your order is finalised.</p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">📍 Pickup Option</h2>
          <p>Prefer to pick it up yourself? You can collect your order from us at:</p>
          <p className="mt-2 font-medium text-ink bg-cream-card p-4 rounded-xl ring-1 ring-black/5 inline-block">
            Sanmar Ocean City / 2 No Gate / Women College Mor, Chittagong
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl text-ink mb-3">💳 Payment</h2>
          <p>We currently accept <strong>Cash on Delivery</strong>. For custom orders, we will share our bKash/Nagad details with you directly on WhatsApp to arrange payment.</p>
        </section>

        <div className="pt-6">
          <Link href="/cakes" className="rounded-full bg-burgundy px-6 py-3 text-cream text-sm font-medium hover:bg-burgundy-dark transition">
            Browse our cakes
          </Link>
        </div>
      </div>
    </div>
  );
}
