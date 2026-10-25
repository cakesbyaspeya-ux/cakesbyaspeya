import { createServerClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PrintButton } from '@/components/admin/PrintButton';

const PKR = (n: number) => '৳' + n.toLocaleString('en-BD');

export default async function PrintReceiptPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const sb = await createServerClient();

  const { data: order, error } = await sb
    .from('orders')
    .select(`
      *,
      order_items (*),
      order_upsells (*)
    `)
    .eq('reference', ref)
    .single();

  if (error || !order) notFound();

  const isPickup = order.delivery_method === 'pickup';

  return (
    <div className="mx-auto max-w-3xl bg-white p-8 text-black print:p-0">
      
      {/* Action Bar (Hidden when printing) */}
      <div className="mb-8 flex items-center justify-between border-b pb-4 print:hidden">
        <Link href={`/admin/orders/${order.reference}`} className="text-sm font-medium text-gray-500 hover:text-black">
          ← Back to Order
        </Link>
        <PrintButton />
      </div>

      {/* Invoice Header */}
      <div className="flex items-start justify-between border-b-2 border-black pb-6 mb-6">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest">Cakes by Aspeya</h1>
          <p className="text-sm mt-1">Sanmar Ocean City / 2 No Gate</p>
          <p className="text-sm">Women College Mor, Chittagong</p>
          <p className="text-sm">+880 1519 409555</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">RECEIPT</h2>
          <p className="text-sm mt-1 font-mono">{order.reference}</p>
          <p className="text-sm">Date: {new Date(order.created_at).toLocaleDateString('en-GB')}</p>
        </div>
      </div>

      {/* Customer & Delivery Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-1">Customer</h3>
          <p className="font-medium text-lg">{order.customer_name}</p>
          <p className="text-sm">{order.phone}</p>
          <p className="text-sm">{order.whatsapp !== order.phone ? `(WA: ${order.whatsapp})` : ''}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-1">
            {isPickup ? 'Pickup Details' : 'Delivery Details'}
          </h3>
          <p className="font-bold">{order.delivery_date} at {order.preferred_time}</p>
          {!isPickup && (
            <>
              <p className="text-sm font-medium mt-1">{order.area}</p>
              <p className="text-sm">{order.address}</p>
            </>
          )}
          {isPickup && <p className="text-sm italic mt-1">Store Pickup</p>}
        </div>
      </div>

      {/* Order Items Table */}
      <table className="w-full mb-8 text-left border-collapse">
        <thead>
          <tr className="border-b-2 border-black">
            <th className="py-2 text-sm font-bold uppercase">Item & Details</th>
            <th className="py-2 text-sm font-bold uppercase text-center">Qty</th>
            <th className="py-2 text-sm font-bold uppercase text-right">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.order_items.map((item: any) => (
            <tr key={item.id} className="border-b border-gray-300">
              <td className="py-3 pr-4">
                <p className="font-bold text-lg">{item.product_name}</p>
                <p className="text-sm text-gray-700">
                  {[item.design_label, item.size_label, item.flavour].filter(Boolean).join(' · ')}
                </p>
                {item.cake_message && (
                  <p className="mt-2 text-lg font-bold border-2 border-black p-2 inline-block print:border-black">
                    ✍️ Message: "{item.cake_message}"
                  </p>
                )}
                {item.custom_design_url && (
                  <p className="text-sm font-bold text-gray-700 mt-1">
                    * Check Dashboard for Custom Design *
                  </p>
                )}
              </td>
              <td className="py-3 text-center font-bold text-lg">{item.qty}</td>
              <td className="py-3 text-right">{PKR(Number(item.line_total))}</td>
            </tr>
          ))}
          
          {/* Upsells / Extras */}
          {order.order_upsells && order.order_upsells.map((u: any) => (
            <tr key={u.id} className="border-b border-gray-300">
              <td className="py-3 pr-4">
                <p className="font-medium text-gray-800">✨ Extra: {u.upsell_name}</p>
              </td>
              <td className="py-3 text-center">{u.qty}</td>
              <td className="py-3 text-right">{PKR(Number(u.unit_price * u.qty))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals & Instructions */}
      <div className="flex justify-between items-start">
        <div className="w-1/2 pr-8">
          <h3 className="text-xs font-bold uppercase text-gray-500 mb-1">Special Instructions</h3>
          <p className="text-sm border border-gray-300 p-2 rounded min-h-[60px]">
            {order.special_instructions || 'None'}
          </p>
        </div>
        <div className="w-1/3">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span>{PKR(Number(order.subtotal) + (order.discount_amount || 0))}</span>
          </div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between py-1 text-sm text-black font-bold">
              <span>Discount ({order.promo_code}):</span>
              <span>-{PKR(Number(order.discount_amount))}</span>
            </div>
          )}
          <div className="flex justify-between py-2 border-t-2 border-black font-bold text-xl mt-2">
            <span>Total:</span>
            <span>{PKR(Number(order.subtotal))}</span>
          </div>
          <p className="text-xs text-center mt-2 text-gray-500">
            * Delivery fee to be collected via WhatsApp
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-gray-400 border-t pt-4 print:mt-8">
        Thank you for choosing Cakes by Aspeya! <br/>
        Generated on {new Date().toLocaleString('en-GB')}
      </div>
    </div>
  );
}