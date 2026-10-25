export const metadata = { title: 'Terms & Conditions' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="font-display text-4xl text-ink mb-6">Terms & Conditions</h1>
      <div className="prose prose-sm md:prose-base text-olive-dark max-w-none space-y-4">
        <h2 className="font-display text-2xl text-ink mt-8">1. Ordering & Notice</h2>
        <p>All custom cakes require a minimum of <strong>24 hours advance notice</strong>. Orders placed for the same day cannot be guaranteed.</p>
        <h2 className="font-display text-2xl text-ink mt-8">2. Payment</h2>
        <p>We currently operate on Cash on Delivery (COD) or advance bKash/Nagad transfer. Our team will confirm the total amount and delivery fee via WhatsApp before baking begins.</p>
        <h2 className="font-display text-2xl text-ink mt-8">3. Cancellations & Refunds</h2>
        <p>Orders cannot be cancelled or refunded once baking has started. If you need to reschedule, please contact us at least 24 hours before the delivery time.</p>
        <h2 className="font-display text-2xl text-ink mt-8">4. Custom Designs</h2>
        <p>While we strive to match uploaded reference images, slight variations in color, design, and decoration may occur due to ingredient availability.</p>
      </div>
    </div>
  );
}