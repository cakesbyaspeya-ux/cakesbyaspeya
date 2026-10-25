export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
      <h1 className="font-display text-4xl text-ink mb-6">Privacy Policy</h1>
      <div className="prose prose-sm md:prose-base text-olive-dark max-w-none space-y-4">
        <p>At Cakes by Aspeya, we respect your privacy and are committed to protecting your personal data.</p>
        <h2 className="font-display text-2xl text-ink mt-8">1. Information We Collect</h2>
        <p>When you place an order, we collect your name, phone number, WhatsApp number, delivery address, and any custom design images you upload. We also collect order details (cakes, flavours, messages).</p>
        <h2 className="font-display text-2xl text-ink mt-8">2. How We Use Your Data</h2>
        <p>We use your information solely to fulfill your order, contact you via WhatsApp regarding delivery, and improve our services. We do not sell your data to third parties.</p>
        <h2 className="font-display text-2xl text-ink mt-8">3. Data Retention</h2>
        <p>Your order details are securely stored in our database for record-keeping. Uploaded design images are stored securely and only accessed by our bakers.</p>
        <h2 className="font-display text-2xl text-ink mt-8">4. Contact Us</h2>
        <p>If you have questions about your data, please message us on WhatsApp at +880 1519 409555.</p>
      </div>
    </div>
  );
}