'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { DeliveryForm } from '@/components/checkout/DeliveryForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CheckoutPage() {
  const { items } = useCart();
  const router = useRouter();

  // If cart is empty, instantly kick them back to the cart page
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  if (items.length === 0) return null; // Prevents flicker before redirect

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
      
      {/* Back button */}
      <Link href="/cart" className="text-sm font-medium text-olive-dark hover:text-burgundy mb-6 inline-block">
        ← Back to Cart Summary
      </Link>

      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Delivery Details</h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Delivery Form */}
        <div>
          <DeliveryForm onBack={() => router.push('/cart')} />
        </div>

        {/* Right Side: Sticky Summary */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}