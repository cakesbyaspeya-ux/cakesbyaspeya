import { createServerClient } from '@/lib/supabase/server';
import { OccasionManager } from './OccasionManager';

export default async function AdminOccasionsPage() {
  const sb = await createServerClient();
  
  // Fetch all occasions ordered by their display sequence
  const { data: occasions, error } = await sb
    .from('occasions')
    .select('*')
    .order('sort_order');

  if (error) {
    console.error('Error fetching occasions:', error);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Occasions & Categories</h1>
        <p className="text-sm text-olive-dark mt-1">
          Manage the dynamic categories shown on the homepage. Upload images and edit titles.
        </p>
      </div>
      
      <OccasionManager initialOccasions={occasions || []} />
    </div>
  );
}