import { NextResponse } from 'next/server';
import { getAdminSession, logAdminActivity } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

/**
 * Sanitizes fields to mitigate spreadsheet formula injection
 * Prepends single quote if field begins with =, +, -, @, or tab/return
 */
function sanitizeCsvCell(val: any): string {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    str = "'" + str;
  }
  // Escape double quotes
  str = str.replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'all'; // 'unfulfilled' or 'all'

    let sql = 'SELECT * FROM orders';
    const args: any[] = [];

    if (filter === 'unfulfilled') {
      sql += " WHERE fulfillment_status = 'unfulfilled'";
    }
    sql += ' ORDER BY created_at DESC';

    const res = await db.execute({ sql, args });

    // CSV Headers
    const headers = [
      'Order Number',
      'Order Date',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Shipping Address Line 1',
      'City',
      'State',
      'Pincode',
      'Country',
      'SKUs',
      'Items Summary',
      'Total Quantity',
      'Grand Total (INR)',
      'Payment Status',
      'Payment Method',
      'Fulfillment Status',
      'Carrier',
      'Tracking Number',
      'Customer Notes'
    ];

    const rows: string[] = [headers.join(',')];

    for (const ord of res.rows) {
      let addr: any = {};
      try { addr = JSON.parse(String(ord.shipping_address)); } catch {}

      let items: any[] = [];
      try { items = JSON.parse(String(ord.items)); } catch {}

      const skus = items.map((i: any) => i.sku || 'N/A').join(' | ');
      const summary = items.map((i: any) => `${i.title} (x${i.quantity})`).join('; ');
      const totalQty = items.reduce((sum: number, i: any) => sum + (Number(i.quantity) || 1), 0);
      const dateStr = new Date(Number(ord.created_at)).toISOString().split('T')[0];

      const row = [
        sanitizeCsvCell(ord.order_number),
        sanitizeCsvCell(dateStr),
        sanitizeCsvCell(ord.customer_name),
        sanitizeCsvCell(ord.customer_email),
        sanitizeCsvCell(ord.customer_phone),
        sanitizeCsvCell(addr.address_line1 || addr.address || ''),
        sanitizeCsvCell(addr.city || ''),
        sanitizeCsvCell(addr.state || ''),
        sanitizeCsvCell(addr.pincode || ''),
        sanitizeCsvCell(addr.country || 'India'),
        sanitizeCsvCell(skus),
        sanitizeCsvCell(summary),
        sanitizeCsvCell(totalQty),
        sanitizeCsvCell(Number(ord.grand_total).toFixed(2)),
        sanitizeCsvCell(ord.payment_status),
        sanitizeCsvCell(ord.payment_method),
        sanitizeCsvCell(ord.fulfillment_status),
        sanitizeCsvCell(ord.carrier || ''),
        sanitizeCsvCell(ord.tracking_number || ''),
        sanitizeCsvCell(ord.customer_notes || '')
      ];

      rows.push(row.join(','));
    }

    const csvContent = rows.join('\r\n');

    await logAdminActivity(session.email, 'EXPORT_FULFILLMENT_CSV', 'orders', undefined, {
      record_count: res.rows.length,
      filter
    });

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="AVZ_Fulfillment_Manifest_${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store, no-cache'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
