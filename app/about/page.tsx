export const metadata = {
  title: 'About Us',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
      <h1 className="font-display text-4xl text-ink md:text-5xl mb-6">Our Story</h1>
      
      <div className="prose prose-lg text-olive-dark max-w-none">
        <p>
          Welcome to <strong>Cakes by Aspeya</strong> — where every celebration gets a little bit sweeter.
        </p>
        <p>
          What started as a passion for baking for friends and family has grown into a small business dedicated to bringing joy to Chittagong. We believe that a cake isn't just a dessert; it's the centerpiece of your happiest moments.
        </p>
        
        <div className="my-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 text-center">
            <div className="text-3xl mb-2">🌿</div>
            <h3 className="font-display text-lg text-ink">Quality First</h3>
            <p className="text-sm mt-1">We use only premium, fresh ingredients — no shortcuts.</p>
          </div>
          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 text-center">
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-display text-lg text-ink">Made to Order</h3>
            <p className="text-sm mt-1">Every cake is baked specifically for your event.</p>
          </div>
          <div className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-display text-lg text-ink">Personal Service</h3>
            <p className="text-sm mt-1">We communicate directly via WhatsApp to ensure perfection.</p>
          </div>
        </div>

        <p>
          Whether you're planning a birthday, anniversary, or just craving a good slice of cake, we're here to bake it for you.
        </p>
      </div>
    </div>
  );
}