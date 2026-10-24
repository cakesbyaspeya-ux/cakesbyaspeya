'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { StepIndicator } from '@/components/checkout/StepIndicator';
import { CartList } from '@/components/checkout/CartList';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { DeliveryForm } from '@/components/checkout/DeliveryForm';

export default function CheckoutPage() {
  const { items } = useCart();
  const [step, setStep] = useState<1 | 2>(1);

  // If cart is empty, show a friendly message
  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="text-6xl opacity-30 mb-4">🛒</div>
        <h1 className="font-display text-3xl text-ink mb-2">Your order is empty</h1>
        <p className="text-olive-dark mb-8">Add a cake or dessert to get started.</p>
        <Link href="/cakes" className="rounded-full bg-burgundy px-8 py-3 text-cream font-medium shadow hover:bg-burgundy-dark transition">
          Browse Cakes
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      <StepIndicator step={step} />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Side (Cart or Form) */}
        <div>
          {step === 1 && (
            <>
              <CartList />
              <div className="mt-8 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="rounded-full bg-burgundy px-8 py-3 text-cream font-medium shadow hover:bg-burgundy-dark transition"
                >
                  Continue to Delivery →
                </button>
              </div>
            </>
          )}

          {step === 2 && <DeliveryForm onBack={() => setStep(1)} />}
        </div>

        {/* Right Side (Sticky Summary) */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}