import { createServerClient } from '@/lib/supabase/server';

export async function NoticeBanner() {
  const sb = await createServerClient();
  const { data } = await sb
    .from('settings')
    .select('key, value')
    .in('key', ['notice_banner', 'ordering_open']);

  const settings = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  
  const bannerText = settings.notice_banner || 'Delivering across Chittagong city · Min 24h advance order';
  const isOpen = settings.ordering_open === true || settings.ordering_open === 'true';

  if (!bannerText) return null;

  return (
    <div className={`px-4 py-2 text-center text-xs font-medium tracking-wide ${
      isOpen ? 'bg-olive text-cream' : 'bg-burgundy text-cream'
    }`}>
      {isOpen ? bannerText : '⚠️ We are currently pausing new orders. Please check back later.'}
    </div>
  );
}