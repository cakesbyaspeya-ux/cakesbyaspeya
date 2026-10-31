import webpush from 'web-push';
import { createAdminClient } from '@/lib/supabase/admin';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:aspeya@cakesbyaspeya.com',
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendOrderPush(orderRef: string, title: string, body: string, url: string) {
  const sb = createAdminClient();
  
  const { data: subscriptions } = await sb
    .from('push_subscriptions')
    .select('subscription')
    .eq('order_reference', orderRef);

  if (!subscriptions || subscriptions.length === 0) return;

  const payload = JSON.stringify({ title, body, url });

  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub.subscription, payload);
    } catch (error: any) {
      if (error.statusCode === 410 || error.statusCode === 404) {
        // Subscription expired, delete it
        await sb.from('push_subscriptions').delete().eq('order_reference', orderRef);
      }
    }
  }
}