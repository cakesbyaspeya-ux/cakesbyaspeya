import { createServerClient } from '@/lib/supabase/server';
import { AnnouncementBarClient } from './AnnouncementBarClient';

export async function AnnouncementBar() {
  const sb = await createServerClient();
  
  // Fetch the admin settings
  const { data } = await sb
    .from('settings')
    .select('key, value')
    .in('key', ['notice_banner', 'ordering_open']);

  const settings = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  
  const adminNotice = settings.notice_banner;
  const isOpen = settings.ordering_open === true || settings.ordering_open === 'true' || settings.ordering_open === undefined;

  return <AnnouncementBarClient adminNotice={adminNotice} isOpen={isOpen} />;
}