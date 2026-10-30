import { NextResponse } from 'next/server';
import { getAdminSession } from '@/src/lib/auth';
import { getDb, initializeDatabase } from '@/src/lib/db';

export async function GET(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initializeDatabase();
    const db = getDb();
    const { searchParams } = new URL(request.url);

    const search = searchParams.get('search') || '';
    const paymentStatus = searchParams.get('payment_status') || '';
    const fulfillmentStatus = searchParams.get('fulfillment_status') || '';

    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;

    let baseFilter = ' WHERE 1=1';
    const filterArgs: any[] = [];

    if (search) {
      baseFilter += ' AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR customer_phone LIKE ?)';
      const term = `%${search}%`;
      filterArgs.push(term, term, term, term);
    }

    if (paymentStatus) {
      baseFilter += ' AND payment_status = ?';
      filterArgs.push(paymentStatus);
    }

    if (fulfillmentStatus) {
      baseFilter += ' AND fulfillment_status = ?';
      filterArgs.push(fulfillmentStatus);
    }

    // Count total matching records
    const countRes = await db.execute({
      sql: `SELECT COUNT(*) as total FROM orders${baseFilter}`,
      args: filterArgs
    });
    const total = Number(countRes.rows[0]?.total || 0);
    const totalPages = Math.ceil(total / limit) || 1;

    // Fetch paginated records
    const sql = `SELECT * FROM orders${baseFilter} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    const res = await db.execute({ sql, args: [...filterArgs, limit, offset] });

    const orders = res.rows.map(row => ({
      ...row,
      subtotal: Number(row.subtotal),
      discount: Number(row.discount),
      shipping_fee: Number(row.shipping_fee),
      tax: Number(row.tax),
      grand_total: Number(row.grand_total),
      shipping_address: (() => { try { return JSON.parse(String(row.shipping_address)); } catch { return {}; } })(),
      items: (() => { try { return JSON.parse(String(row.items)); } catch { return []; } })()
    }));

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
