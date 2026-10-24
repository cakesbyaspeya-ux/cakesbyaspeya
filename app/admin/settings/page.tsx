import { createServerClient } from '@/lib/supabase/server';
import { SettingsForm } from './SettingsForm';

export default async function AdminSettingsPage() {
  const sb = await createServerClient();
  
  const { data } = await sb.from('settings').select('*');
  
  // Convert array of {key, value} into a single object
  const settings = Object.fromEntries((data ?? []).map((r: any) => [r.key, r.value]));

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Settings</h1>
        <p className="text-sm text-olive-dark mt-1">Manage your shop's global configuration.</p>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}