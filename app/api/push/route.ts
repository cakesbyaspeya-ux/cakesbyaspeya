import { NextResponse } from 'next/server';
import { sendOrderPush } from '@/lib/push';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    // Verify the user is logged in as an admin
    const sb = await createServerClient();
    const { data: { user } } = await sb.auth.getUser();
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { orderRef, title, body, url } = await req.json();
    await sendOrderPush(orderRef, title, body, url);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}