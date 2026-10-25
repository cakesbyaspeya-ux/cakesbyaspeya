'use client';

import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { CartList } from '@/components/checkout/CartList';
import { OrderSummary } from '@/components/checkout/OrderSummary';

export default function CartPage() {
  const { items } = useCart();

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
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl text-ink">Your Order Summary</h1>
        <Link href="/cakes" className="text-sm text-burgundy hover:underline font-medium hidden md:block">
          + Add more items
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Cart Items & Upsells */}
        <div>
          <CartList />
          
          <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link href="/cakes" className="text-sm text-burgundy hover:underline font-medium md:hidden">
              + Add more items
            </Link>
            
            {/* 👇 This button now goes to the Customer Info page */}
            <Link 
              href="/checkout/info" 
              className="w-full sm:w-auto text-center rounded-full bg-burgundy px-8 py-3.5 text-cream font-medium shadow hover:bg-burgundy-dark transition"
            >
              Proceed to Checkout →
            </Link>
          </div>
        </div>

        {/* Right Side: Sticky Summary (Promo Code & Totals) */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <OrderSummary />
        </aside>
      </div>
    </div>
  );
}