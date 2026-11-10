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

    const filter = searchParams.get('filter') || 'all'; // legacy fallback
    const startDate = searchParams.get('startDate') || searchParams.get('from_date');
    const endDate = searchParams.get('endDate') || searchParams.get('to_date');
    const paymentStatus = searchParams.get('payment_status') || searchParams.get('paymentStatus') || '';
    const fulfillmentStatus = searchParams.get('fulfillment_status') || searchParams.get('fulfillmentStatus') || '';
    const search = searchParams.get('search') || '';

    let sql = 'SELECT * FROM orders';
    const whereClauses: string[] = [];
    const args: any[] = [];

    // Date range filtering
    if (startDate) {
      let startMs = Number(startDate);
      if (isNaN(startMs) || startMs < 1000000000000) {
        startMs = new Date(`${startDate}T00:00:00`).getTime();
      }
      if (!isNaN(startMs)) {
        whereClauses.push('created_at >= ?');
        args.push(startMs);
      }
    }

    if (endDate) {
      let endMs = Number(endDate);
      if (isNaN(endMs) || endMs < 1000000000000) {
        endMs = new Date(`${endDate}T23:59:59.999`).getTime();
      }
      if (!isNaN(endMs)) {
        whereClauses.push('created_at <= ?');
        args.push(endMs);
      }
    }

    // Payment status filter
    if (paymentStatus && paymentStatus !== 'all') {
      whereClauses.push('LOWER(payment_status) = ?');
      args.push(paymentStatus.toLowerCase().trim());
    }

    // Fulfillment status filter
    if (fulfillmentStatus && fulfillmentStatus !== 'all') {
      whereClauses.push('LOWER(fulfillment_status) = ?');
      args.push(fulfillmentStatus.toLowerCase().trim());
    }

    // Legacy or status preset shortcuts
    if (!paymentStatus && !fulfillmentStatus) {
      if (filter === 'unfulfilled') {
        whereClauses.push("LOWER(fulfillment_status) = 'unfulfilled'");
      } else if (filter === 'completed') {
        whereClauses.push("(LOWER(payment_status) = 'paid' AND LOWER(fulfillment_status) IN ('delivered', 'shipped'))");
      } else if (filter === 'pending') {
        whereClauses.push("(LOWER(payment_status) = 'pending' OR LOWER(fulfillment_status) = 'unfulfilled')");
      } else if (filter === 'cancelled') {
        whereClauses.push("(LOWER(payment_status) = 'cancelled' OR LOWER(fulfillment_status) = 'cancelled')");
      }
    }

    // Search filter
    if (search && search.trim()) {
      whereClauses.push('(order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)');
      const term = `%${search.trim()}%`;
      args.push(term, term, term, term);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    sql += ' ORDER BY created_at DESC';

    const res = await db.execute({ sql, args });

    // Build authoritative product catalog lookup so CSV uses real product names from the boutique catalog
    const prodCatalogRes = await db.execute('SELECT id, sku, title FROM products');
    const catalogBySku = new Map<string, string>();
    const catalogById = new Map<string, string>();
    for (const p of prodCatalogRes.rows) {
      if (p.sku) catalogBySku.set(String(p.sku).trim().toUpperCase(), String(p.title).trim());
      if (p.id) catalogById.set(String(p.id).trim(), String(p.title).trim());
    }

    const resolveItemTitle = (item: any): string => {
      const sku = item.sku ? String(item.sku).trim().toUpperCase() : '';
      if (sku && catalogBySku.has(sku)) return catalogBySku.get(sku)!;
      const id = item.id ? String(item.id).trim() : '';
      if (id && catalogById.has(id)) return catalogById.get(id)!;
      return String(item.title || item.name || 'Wearable Art Piece').trim();
    };

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
      const summary = items.map((i: any) => `${resolveItemTitle(i)} (x${i.quantity || 1})`).join('; ');
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
      filter,
      startDate,
      endDate,
      paymentStatus,
      fulfillmentStatus
    });

    const filenameParts = ['AVZ_Orders'];
    if (paymentStatus && paymentStatus !== 'all') filenameParts.push(paymentStatus);
    if (fulfillmentStatus && fulfillmentStatus !== 'all') filenameParts.push(fulfillmentStatus);
    if (startDate) filenameParts.push(`from_${startDate}`);
    if (endDate) filenameParts.push(`to_${endDate}`);
    filenameParts.push(new Date().toISOString().slice(0, 10));
    const safeFilename = filenameParts.join('_').replace(/[^a-zA-Z0-9_\-]/g, '_') + '.csv';

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeFilename}"`,
        'Cache-Control': 'no-store, no-cache'
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
