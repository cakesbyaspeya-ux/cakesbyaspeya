'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/cart/CartProvider';

export function DeliveryForm({ onBack }: { onBack: () => void }) {
  const router = useRouter();
  const { items, upsells, promoCode, discountAmount, total, clear } = useCart();
  
  const [method, setMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address & Location states
  const [address, setAddress] = useState('');
  const [area, setArea] = useState('');
  const [locating, setLocating] = useState(false);

  // Conditions & Availability states
  const [agreed, setAgreed] = useState(false);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Fetch blocked dates on load
  useEffect(() => {
    fetch('/api/lookup/availability')
      .then(res => res.json())
      .then(data => setBlockedDates(data.blockedDates || []))
      .catch(() => {});
  }, []);

  const AREAS = [
    'Chawkbazar', 'Kotwali', 'Panchlaish', 'Khulshi', 'Halishahar', 
    'Double Mooring', 'Pahartali', 'Chandgaon', 'Bayezid', 'Bakalia', 
    'Patenga', 'Bandar'
  ];

  // Handle Current Location Button
  async function handleUseCurrentLocation() {
    if (!navigator.geolocation) return alert('Geolocation is not supported by your browser');
    setLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch('/api/geocode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat: latitude, lng: longitude }),
          });
          const data = await res.json();
          
          if (res.ok && data.address) {
            setAddress(data.address);
            const detectedArea = AREAS.find(a => data.address.includes(a));
            if (detectedArea) setArea(detectedArea);
          } else {
            alert(`API Error: ${data.error}`);
          }
        } catch (err) {
          alert('Failed to connect to the server.');
        } finally {
          setLocating(false);
        }
      },
      (err) => { setLocating(false); alert('Location Error: Please allow location access.'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return setError('You must agree to the terms and conditions to place an order.');
    
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const payload = {
      customer_name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      delivery_method: method,
      delivery_date: data.date,
      preferred_time: data.time,
      area: method === 'delivery' ? area : null,
      address: method === 'delivery' ? address : null,
      special_instructions: data.instructions,
      promo_code: promoCode,
      discount_amount: discountAmount,
      final_total: total,
      items: items.map(it => ({
        product_id: it.product_id,
        product_name: it.product_name,
        design_id: it.design_id,       
        design_label: it.design_label, 
        image: it.image,               
        custom_design_url: it.custom_design_url, 
        flavour: it.flavour,
        size_label: it.size_label,
        cake_message: it.cake_message,
        unit_price: it.unit_price,
        qty: it.qty,
      })),
      upsells: upsells.map(u => ({
        id: u.id, name: u.name, price: u.price, qty: u.qty
      }))
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to place order');

      sessionStorage.setItem('cba_last_order', JSON.stringify({ ref: json.reference, waUrl: json.waUrl }));
      clear();
      
      // 🚀 NO AUTO-REDIRECT: Go straight to our new Download PDF page
      router.push(`/order-confirmed/${json.reference}`);
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-medium text-olive-dark hover:text-burgundy">
        ← Back to items
      </button>

      {error && <div className="rounded-xl bg-burgundy/10 p-4 text-sm text-burgundy">{error}</div>}

      {/* 1. Customer Details */}
      <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 space-y-4">
        <legend className="px-2 text-sm font-medium text-olive-dark">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Full name</span>
            <input type="text" name="name" placeholder="e.g. Khaled Rahman" className="input" required />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Phone (01XXXXXXXXX)</span>
            <input type="tel" name="phone" placeholder="01XXXXXXXXX" className="input" required />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">WhatsApp (if different)</span>
          <input type="tel" name="whatsapp" placeholder="01XXXXXXXXX" className="input" />
        </label>
      </fieldset>

      {/* 2. Delivery Method */}
      <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
        <legend className="px-2 text-sm font-medium text-olive-dark">Delivery method</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={`cursor-pointer rounded-xl border p-4 transition ${method === 'delivery' ? 'border-burgundy bg-burgundy/5' : 'border-olive/30'}`}>
            <input type="radio" checked={method === 'delivery'} onChange={() => setMethod('delivery')} className="mr-2 accent-burgundy" />
            <span className="text-sm font-medium">Home delivery</span>
          </label>
          <label className={`cursor-pointer rounded-xl border p-4 transition ${method === 'pickup' ? 'border-burgundy bg-burgundy/5' : 'border-olive/30'}`}>
            <input type="radio" checked={method === 'pickup'} onChange={() => setMethod('pickup')} className="mr-2 accent-burgundy" />
            <span className="text-sm font-medium">Store pickup</span>
          </label>
        </div>
      </fieldset>

      {/* 3. Schedule */}
      <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5 space-y-4">
        <legend className="px-2 text-sm font-medium text-olive-dark">Schedule</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink">Date</span>
            <input 
              type="date" 
              name="date" 
              min={minDate} 
              className="input" 
              required 
              onChange={(e) => {
                if (blockedDates.includes(e.target.value)) {
                  alert('Sorry, we are fully booked on this date. Please select another day.');
                  e.target.value = '';
                }
              }}
            />
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

      {/* 4. Delivery Address */}
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

      {/* 5. Instructions */}
      <fieldset className="rounded-2xl bg-cream-card p-5 md:p-6 ring-1 ring-black/5">
        <legend className="px-2 text-sm font-medium text-olive-dark">Special instructions</legend>
        <textarea name="instructions" rows={2} placeholder="Allergies, design notes (optional)" className="input" />
      </fieldset>

      {/* 6. Terms & Conditions Checkbox */}
      <label className="flex items-start gap-3 rounded-2xl bg-cream-card p-5 ring-1 ring-black/5 cursor-pointer">
        <input 
          type="checkbox" 
          checked={agreed} 
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 w-4 h-4 accent-burgundy" 
          required
        />
        <span className="text-sm text-olive-dark leading-tight">
          I agree to the <strong>24-hour advance notice policy</strong>. I understand that custom cakes cannot be cancelled or refunded once baking has started.
        </span>
      </label>

      <div className="flex flex-col items-end gap-2">
        <button type="submit" disabled={loading} className="rounded-full bg-burgundy px-8 py-3.5 font-medium text-white shadow hover:bg-burgundy-dark disabled:opacity-50 transition w-full sm:w-auto">
          {loading ? 'Placing Order...' : 'Place Order & Get Receipt →'}
        </button>
      </div>
    </form>
  );
}