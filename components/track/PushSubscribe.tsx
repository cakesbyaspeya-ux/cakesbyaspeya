'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function PushSubscribe({ orderRef }: { orderRef: string }) {
  const [subscribed, setSubscribed] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) setSupported(true);
    if (localStorage.getItem(`push_${orderRef}`) === 'true') setSubscribed(true);
  }, [orderRef]);

  async function subscribe() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return alert('Permission denied.');

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      });

      const sb = createClient();
      await sb.from('push_subscriptions').insert({
        order_reference: orderRef,
        subscription: subscription.toJSON(),
      });

      localStorage.setItem(`push_${orderRef}`, 'true');
      setSubscribed(true);
    } catch (error) {
      alert('Failed to enable notifications.');
    }
  }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  if (!supported) return null;

  if (subscribed) {
    return (
      <div className="rounded-xl bg-olive/10 p-4 text-center ring-1 ring-olive/20">
        <p className="text-sm font-medium text-olive-dark">🔔 Notifications Enabled</p>
        <p className="text-xs text-olive-dark mt-1">We will alert you when your order status changes.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-cream-dark p-4 flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink">Get live status updates</p>
        <p className="text-xs text-olive-dark">Tap to allow browser notifications.</p>
      </div>
      <button onClick={subscribe} className="rounded-full bg-burgundy px-4 py-2 text-xs font-medium text-cream shadow hover:bg-burgundy-dark transition">
        Enable
      </button>
    </div>
  );
}