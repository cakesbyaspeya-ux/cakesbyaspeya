import { createAdminClient } from '@/lib/supabase/admin';
import { notFound } from 'next/navigation';
import { OrderSuccessClient } from './OrderSuccessClient';

export default async function OrderConfirmedPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const sb = createAdminClient();

  // Fetch the full order details securely
  const { data: order, error } = await sb
    .from('orders')
    .select(`*, order_items(*), order_upsells(*)`)
    .eq('reference', ref)
    .single();

  if (error || !order) {
    notFound();
  }

  return <OrderSuccessClient order={order} />;
}