'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';

export default function CheckoutInfoPage() {
  const router = useRouter();
  const { items } = useCart();
  
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [locating, setLocating] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const minDate = tomorrow.toISOString().split('T')[0];
  
  const AREAS = ['Chawkbazar', 'Kotwali', 'Panchlaish', 'Khulshi', 'Halishahar', 'Double Mooring', 'Pahartali', 'Chandgaon', 'Bayezid', 'Bakalia', 'Patenga', 'Bandar'];

  useEffect(() => {
    if (items.length === 0) router.push('/cart');
    fetch('/api/lookup/availability').then(res => res.json()).then(data => setBlockedDates(data.blockedDates || [])).catch(() => {});
  }, [items, router]);

  async function handleUseCurrentLocation() {
    if (!navigator.geolocation) return alert('Geolocation is not supported');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch('/api/geocode', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: position.coords.latitude, lng: position.coords.longitude }),
          });
          const data = await res.json();
          if (res.ok && data.address) {
            setAddress(data.address);
            const detected = AREAS.find(a => data.address.includes(a));
            if (detected) setArea(detected);
          } else { alert(`API Error: ${data.error}`); }
        } catch { alert('Failed to fetch location.'); } finally { setLocating(false); }
      },
      () => { setLocating(false); alert('Please allow location access.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleContinue(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return setError('You must agree to the terms and conditions.');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp') || formData.get('phone'),
      method,
      date: formData.get('date'),
      time: formData.get('time'),
      area: method === 'delivery' ? area : null,
      address: method === 'delivery' ? address : null,
      instructions: formData.get('instructions'),
    };
    
    sessionStorage.setItem('cba_checkout_info', JSON.stringify(data));
    router.push('/checkout/summary');
  }

  if (items.length === 0) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-16">
      <Link href="/cart" className="text-sm font-medium text-olive-dark hover:text-burgundy mb-6 inline-block">← Back to Cart</Link>
      <h1 className="font-display text-3xl md:text-4xl text-ink mb-8">Customer Information</h1>

      <form onSubmit={handleContinue} className="space-y-6">
        {error && <div className="rounded-xl bg-burgundy/10 p-4 text-sm text-burgundy">{error}</div>}

        <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 space-y-4">
          <legend className="px-2 text-sm font-medium text-olive-dark">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink">Full name</span><input type="text" name="name" placeholder="e.g. Khaled Rahman" className="input" required /></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-ink">Phone (01XXXXXXXXX)</span><input type="tel" name="phone" placeholder="01XXXXXXXXX" className="input" required /></label>
          </div>
          <label className="block"><span className="mb-1 block text-sm font-medium text-ink">WhatsApp (if different)</span><input type="tel" name="whatsapp" placeholder="01XXXXXXXXX" className="input" /></label>
        </fieldset>

        <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
          <legend className="px-2 text-sm font-medium text-olive-dark">Delivery method</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={`cursor-pointer rounded-xl border p-4 transition ${method === 'delivery' ? 'border-burgundy bg-burgundy/5' : 'border-olive/30'}`}>
              <input type="radio" checked={method === 'delivery'} onChange={() => setMethod('delivery')} className="mr-2 accent-burgundy" /><span className="text-sm font-medium">Home delivery</span>
            </label>
            <label className={`cursor-pointer rounded-xl border p-4 transition ${method === 'pickup' ? 'border-burgundy bg-burgundy/5' : 'border-olive/30'}`}>
              <input type="radio" checked={method === 'pickup'} onChange={() => setMethod('pickup')} className="mr-2 accent-burgundy" /><span className="text-sm font-medium">Store pickup</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 space-y-4">
          <legend className="px-2 text-sm font-medium text-olive-dark">Schedule</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Date</span>
              <input type="date" name="date" min={minDate} className="input" required onChange={(e) => {
                if (blockedDates.includes(e.target.value)) { alert('Sorry, fully booked. Pick another date.'); e.target.value = ''; }
              }} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Preferred Time</span>
              <select name="time" className="input" required defaultValue="">
                <option value="" disabled>Select a time slot</option>
                <option value="11:00 AM – 2:00 PM">11:00 AM – 2:00 PM</option>
                <option value="4:00 PM – 7:00 PM">4:00 PM – 7:00 PM</option>
                <option value="7:00 PM – 9:00 PM">7:00 PM – 9:00 PM</option>
                <option value="Custom">Custom (discuss on WhatsApp)</option>
              </select>
            </label>
          </div>
        </fieldset>

        {method === 'delivery' && (
          <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 space-y-4">
            <legend className="px-2 text-sm font-medium text-olive-dark">Delivery address</legend>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Area</span>
              <select name="area" value={area} onChange={(e) => setArea(e.target.value)} className="input" required>
                <option value="" disabled>Select your area</option>
                {AREAS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </label>
            <div className="block">
              <span className="mb-1 block text-sm font-medium text-ink">Full address</span>
              <textarea name="address" rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, road, landmark..." className="input" required />
              <button type="button" onClick={handleUseCurrentLocation} disabled={locating} className="mt-2 flex items-center gap-2 text-sm font-medium text-burgundy hover:text-burgundy-dark transition disabled:opacity-50">
                {locating ? '📍 Getting location...' : '📍 Use my current location'}
              </button>
            </div>
          </fieldset>
        )}

        <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
          <legend className="px-2 text-sm font-medium text-olive-dark">Special instructions</legend>
          <textarea name="instructions" rows={2} placeholder="Allergies, design notes (optional)" className="input" />
        </fieldset>

        <label className="flex items-start gap-3 rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-burgundy" required />
          <span className="text-sm text-olive-dark leading-tight">I agree to the <strong>24-hour advance notice policy</strong>. I understand that custom cakes cannot be cancelled or refunded once baking has started.</span>
        </label>

        <div className="flex justify-end pt-2">
          <button type="submit" className="w-full sm:w-auto rounded-full bg-burgundy px-8 py-3.5 font-medium text-white shadow hover:bg-burgundy-dark transition">
            Review Order →
          </button>
        </div>
      </form>
    </div>
  );
}