'use client';

import { useCart } from '@/components/cart/CartProvider';
import { ImageSlideshow } from '@/components/product/ImageSlideshow';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export function CartList() {
  const { items, setQty, remove } = useCart();

  return (
    <ul className="space-y-4">
      {items.map((it) => (
        <li key={it.key} className="flex gap-4 rounded-2xl bg-cream-card p-3 md:p-4 ring-1 ring-black/5">
          <div className="h-20 w-20 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-xl bg-cream-dark">
            {it.image ? (
              <img src={it.image} alt={it.product_name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl opacity-30">🎂</div>
            )}
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-display font-medium text-ink text-lg">{it.product_name}</p>
                <div className="mt-1 text-xs text-olive-dark space-y-0.5">
                  {it.variant && <div>Type: {it.variant}</div>}
                  {it.flavour && <div>Flavour: {it.flavour}</div>}
                  {it.size_label && <div>Size: {it.size_label}</div>}
                  {it.cake_message && (
                    <div className="mt-1 italic text-burgundy">"{it.cake_message}"</div>
                  )}
                </div>
              </div>
              <button
                onClick={() => remove(it.key)}
                className="text-xs text-burgundy hover:underline shrink-0"
              >
                Remove
              </button>
            </div>

            <div className="mt-auto flex items-end justify-between pt-4">
              <div className="flex items-center rounded-full border border-olive/30 bg-cream">
                <button onClick={() => setQty(it.key, it.qty - 1)} className="px-3 py-1 text-olive-dark hover:text-burgundy">−</button>
                <span className="w-6 text-center text-sm font-medium">{it.qty}</span>
                <button onClick={() => setQty(it.key, it.qty + 1)} className="px-3 py-1 text-olive-dark hover:text-burgundy">+</button>
              </div>
              <div className="text-right">
                <div className="text-xs text-olive-dark">{PKR(it.unit_price)} each</div>
                <div className="font-medium text-ink">{PKR(it.unit_price * it.qty)}</div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}