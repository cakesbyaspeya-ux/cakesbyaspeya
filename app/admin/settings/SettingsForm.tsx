'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, any> }) {
  const router = useRouter();
  const sb = createClient();
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    whatsapp_number: initialSettings.whatsapp_number || '8801519409555',
    pickup_address: initialSettings.pickup_address || 'Sanmar Ocean City / 2 No Gate / Women College Mor, Chittagong',
    advance_notice_hours: initialSettings.advance_notice_hours || 24,
    notice_banner: initialSettings.notice_banner || 'Delivering across Chittagong city · Min 24h advance order',
    ordering_open: initialSettings.ordering_open === true || initialSettings.ordering_open === 'true',
    show_totals_in_message: initialSettings.show_totals_in_message === true || initialSettings.show_totals_in_message === 'true',
    telegram_enabled: initialSettings.telegram_enabled === true || initialSettings.telegram_enabled === 'true',
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const updates = [
      { key: 'whatsapp_number', value: formData.whatsapp_number },
      { key: 'pickup_address', value: formData.pickup_address },
      { key: 'advance_notice_hours', value: Number(formData.advance_notice_hours) },
      { key: 'notice_banner', value: formData.notice_banner },
      { key: 'ordering_open', value: formData.ordering_open },
      { key: 'show_totals_in_message', value: formData.show_totals_in_message },
      { key: 'telegram_enabled', value: formData.telegram_enabled },
    ];

    // Update all settings
    for (const update of updates) {
      await sb.from('settings').upsert({ key: update.key, value: update.value });
    }

    setSaving(false);
    router.refresh();
    alert('Settings saved successfully!');
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 space-y-4">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2">Contact & Location</h2>
        
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">WhatsApp Number</span>
          <input 
            type="text" 
            value={formData.whatsapp_number} 
            onChange={e => setFormData({ ...formData, whatsapp_number: e.target.value })}
            className="input" 
            placeholder="8801519409555 (no + or spaces)"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Pickup Address</span>
          <textarea 
            value={formData.pickup_address} 
            onChange={e => setFormData({ ...formData, pickup_address: e.target.value })}
            className="input" 
            rows={2}
          />
        </label>
      </section>

      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 space-y-4">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2">Rules & Banners</h2>
        
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Advance Notice (Hours)</span>
          <input 
            type="number" 
            value={formData.advance_notice_hours} 
            onChange={e => setFormData({ ...formData, advance_notice_hours: e.target.value })}
            className="input" 
          />
          <span className="text-xs text-olive-dark mt-1 block">Default is 24. Customers cannot select a date before this.</span>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-ink">Top Notice Banner</span>
          <input 
            type="text" 
            value={formData.notice_banner} 
            onChange={e => setFormData({ ...formData, notice_banner: e.target.value })}
            className="input" 
          />
        </label>
      </section>

      <section className="rounded-2xl bg-cream-card p-6 ring-1 ring-black/5 space-y-4">
        <h2 className="font-display text-xl border-b border-olive/20 pb-2">Toggles</h2>
        
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.ordering_open} 
              onChange={e => setFormData({ ...formData, ordering_open: e.target.checked })}
              className="accent-burgundy w-4 h-4"
            />
            <span className="text-sm font-medium">Ordering is Open (uncheck to pause new orders)</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.show_totals_in_message} 
              onChange={e => setFormData({ ...formData, show_totals_in_message: e.target.checked })}
              className="accent-burgundy w-4 h-4"
            />
            <span className="text-sm font-medium">Show Totals in WhatsApp Message</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={formData.telegram_enabled} 
              onChange={e => setFormData({ ...formData, telegram_enabled: e.target.checked })}
              className="accent-burgundy w-4 h-4"
            />
            <span className="text-sm font-medium">Enable Telegram Alerts for New Orders</span>
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button 
          type="submit" 
          disabled={saving}
          className="rounded-full bg-burgundy px-8 py-3 text-cream font-medium shadow hover:bg-burgundy-dark transition disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </form>
  );
}