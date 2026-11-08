import { NextResponse } from 'next/server';
import { getDb, initializeDatabase } from '@/src/lib/db';
import { getClientIp, checkRateLimit } from '@/src/lib/security';

function maskName(name: string): string {
  if (!name) return 'Valued Patron';
  const parts = name.trim().split(' ');
  return parts
    .map((p) => (p.length > 1 ? `${p[0]}${'*'.repeat(Math.min(4, p.length - 1))}` : p))
    .join(' ');
}

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit(`order_track_${clientIp}`, 15, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many tracking requests. Please try again in ${rateCheck.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const rawNumber = searchParams.get('number')?.trim().toUpperCase();

    if (!rawNumber) {
      return NextResponse.json({ error: 'Order identifier is required' }, { status: 400 });
    }

    const cleanOrderNumber = rawNumber.startsWith('AVZ-') ? rawNumber : `AVZ-${rawNumber}`;

    await initializeDatabase();
    const db = getDb();

    const res = await db.execute({
      sql: 'SELECT id, order_number, customer_name, fulfillment_status, payment_status, payment_method, carrier, tracking_number, items, created_at FROM orders WHERE order_number = ?',
      args: [cleanOrderNumber]
    });

    if (res.rows.length === 0) {
      return NextResponse.json(
        { error: `No studio order found matching '${cleanOrderNumber}'. Please verify your receipt or contact concierge.` },
        { status: 404 }
      );
    }

    const row: any = res.rows[0];
    const items = JSON.parse(row.items || '[]');

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: row.order_number,
        customerMasked: maskName(row.customer_name),
        fulfillmentStatus: row.fulfillment_status || 'unfulfilled',
        paymentStatus: row.payment_status || 'pending',
        paymentMethod: row.payment_method || 'Razorpay',
        carrier: row.carrier || 'Express Air Logistics (Blue Dart / Delhivery)',
        trackingNumber: row.tracking_number || null,
        itemsCount: items.length,
        createdAt: Number(row.created_at)
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error tracking order' }, { status: 500 });
  }
}
