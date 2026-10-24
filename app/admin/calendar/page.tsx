import Link from 'next/link';
import { createServerClient } from '@/lib/supabase/server';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, addMonths, subMonths, parseISO, isSameDay } from 'date-fns';

export default async function AdminCalendar({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const currentMonth = month ? parseISO(`${month}-01`) : new Date();
  
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });
  const prevMonth = format(subMonths(start, 1), 'yyyy-MM');
  const nextMonth = format(addMonths(start, 1), 'yyyy-MM');

  const sb = await createServerClient();
  
  // Fetch all orders for this month
  const { data: orders } = await sb
    .from('orders')
    .select('reference, customer_name, delivery_date, status')
    .gte('delivery_date', format(start, 'yyyy-MM-dd'))
    .lte('delivery_date', format(end, 'yyyy-MM-dd'))
    .neq('status', 'cancelled')
    .neq('status', 'delivered');

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-ink">
          {format(start, 'MMMM yyyy')}
        </h1>
        <div className="flex gap-2">
          <Link href={`/admin/calendar?month=${prevMonth}`} className="rounded-full bg-cream-card px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-cream-dark">
            ← Prev
          </Link>
          <Link href={`/admin/calendar?month=${nextMonth}`} className="rounded-full bg-cream-card px-4 py-2 text-sm ring-1 ring-black/5 hover:bg-cream-dark">
            Next →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-olive-dark py-2">
            {d}
          </div>
        ))}

        {/* Empty slots for days before the 1st */}
        {Array.from({ length: start.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="rounded-xl bg-cream-dark/20 min-h-[100px]" />
        ))}

        {/* Actual Days */}
        {days.map(day => {
          const dayOrders = orders?.filter(o => isSameDay(parseISO(o.delivery_date), day)) || [];
          
          return (
            <div key={day.toISOString()} className="rounded-xl bg-cream-card p-2 ring-1 ring-black/5 min-h-[100px] flex flex-col">
              <span className="text-xs font-medium text-olive-dark mb-1">{format(day, 'd')}</span>
              
              <div className="space-y-1 overflow-y-auto flex-1 custom-scrollbar">
                {dayOrders.map(order => (
                  <Link 
                    key={order.reference}
                    href={`/admin/orders/${order.reference}`}
                    className={`block text-[10px] truncate rounded px-1.5 py-1 font-medium hover:opacity-80 transition ${
                      order.status === 'new' ? 'bg-burgundy text-cream' : 
                      order.status === 'baking' ? 'bg-[#d98e3a] text-white' : 
                      'bg-olive/10 text-olive-dark'
                    }`}
                    title={`${order.customer_name} - ${order.status}`}
                  >
                    {order.customer_name}
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}